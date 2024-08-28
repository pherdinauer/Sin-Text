<template>
  <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 sm:max-w-xl sm:mx-auto">
      <div class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
      <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        <div class="max-w-md mx-auto">
          <div>
            <h1 class="text-2xl font-semibold text-center">Sintesi Documenti</h1>
          </div>
          <div class="mt-8">
            <button @click="showModal = true" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-300">
              Carica File
            </button>
          </div>
          <div class="mt-8">
            <h2 class="text-lg font-semibold">Sintesi:</h2>
            <div v-if="summary" class="mt-4 p-4 bg-gray-50 rounded-lg">
              <p class="text-gray-700">{{ summary }}</p>
            </div>
            <p v-else class="mt-4 text-gray-500 text-center">La sintesi apparirà qui dopo l'elaborazione del file.</p>
          </div>
        </div>
      </div>
    </div>

    <UploadModal v-if="showModal" @close="showModal = false" @file-processed="onFileProcessed" />
  </div>
</template>

<script>
import UploadModal from './UploadModal.vue';

export default {
  name: 'HomeView',
  components: {
    UploadModal
  },
  data() {
    return {
      summary: '',
      showModal: false
    };
  },
  methods: {
    onFileProcessed(summary) {
      this.summary = summary;
      this.showModal = false;
    }
  }
};
</script>