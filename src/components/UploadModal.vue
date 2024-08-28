<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4 text-center text-gray-800">Carica File</h2>
      <div 
        class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-all duration-300 ease-in-out"
        :class="{ 'bg-blue-50 border-blue-300': isDragging }"
        @dragover.prevent 
        @drop.prevent="onFileDrop"
        @dragenter.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @click="$refs.fileInput.click()"
      >
        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <p class="mt-1 text-sm text-gray-600">
          <span class="font-medium text-blue-600 hover:text-blue-500">
            {{ file ? file.name : 'Trascina qui il tuo file o clicca per selezionarlo' }}
          </span>
        </p>
        <p class="mt-1 text-xs text-gray-500">PDF o TXT fino a 10MB</p>
        <input type="file" @change="onFileUpload" accept=".txt,.pdf" ref="fileInput" class="hidden">
      </div>
      <div v-if="uploadProgress > 0" class="mt-4">
        <div class="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
          <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: `${uploadProgress}%` }"></div>
        </div>
        <p class="text-center text-sm text-gray-600 mt-1">{{ uploadProgress }}% caricato</p>
      </div>
      <div class="mt-6 flex justify-between">
        <button @click="processFile" :disabled="!file" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed">
          Elabora file
        </button>
        <button @click="$emit('close')" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out">
          Chiudi
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      file: null,
      isDragging: false,
      uploadProgress: 0
    }
  },
  methods: {
    onFileUpload(event) {
      this.file = event.target.files[0];
    },
    onFileDrop(event) {
      this.isDragging = false;
      this.file = event.dataTransfer.files[0];
    },
    async processFile() {
      if (!this.file) return;

      const formData = new FormData();
      formData.append('file', this.file);

      try {
        const response = await axios.post('/api/process-file', formData, {
          onUploadProgress: (progressEvent) => {
            this.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          }
        });
        this.htmlFile = response.data.htmlFile;
        this.$emit('file-processed', this.htmlFile);
        this.uploadProgress = 0;
      } catch (error) {
        console.error('Errore durante l\'elaborazione del file:', error);
        this.uploadProgress = 0;
      }
    }
  }
}
</script>