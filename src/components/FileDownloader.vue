<template>
  <div class="sin-text">
    <h1>Sin-Text</h1>
    <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="onFileDrop">
      <input type="file" ref="fileInput" @change="handleFileUpload" accept=".pdf" class="file-input" />
      <i class="fas fa-cloud-upload-alt"></i>
      <p v-if="!selectedFile">Trascina qui il tuo file PDF o clicca per selezionarlo</p>
      <p v-else class="file-name">{{ selectedFile.name }}</p>
    </div>
    <button 
      @click="uploadFile" 
      :disabled="!selectedFile || processing" 
      class="process-button"
      :title="!selectedFile ? 'Devi prima caricare un file!' : ''"
    >
      <i v-if="!processing" class="fas fa-cogs"></i>
      <span v-else class="spinner"></span>
      {{ processing ? 'Analisi in corso...' : 'Analizza' }}
    </button>
    
    <!-- Nuova box informativa -->
    <div v-if="processing" class="info-box">
      <p><strong>Stato elaborazione:</strong></p>
      <p v-if="currentStep === 'model_selection'">
        <i class="fas fa-cog fa-spin"></i> Scelta modello AI in corso
      </p>
      <p v-else-if="currentStep === 'analysis'">
        <i class="fas fa-brain"></i> Analisi in corso
      </p>
      <p v-else-if="currentStep === 'document_production'">
        <i class="fas fa-file-alt"></i> Produzione del documento
      </p>
    </div>

    <div v-if="currentStatus" class="status-message">
      <i :class="statusIcon"></i>
      {{ currentStatus }}
    </div>
    <div v-if="fileName" class="download-link">
      <button @click="downloadFile" class="download-button">
        <i class="fas fa-download"></i> Scarica DOCX
      </button>
    </div>
    <div v-if="error" class="error">
      <i class="fas fa-exclamation-circle"></i> {{ error }}
    </div>
    <div v-if="processing" class="progress-bar-container">
      <div class="progress-bar" :style="{ width: `${progressPercentage}%` }"></div>
    </div>
  </div>
</template>

<script>
import { API_URL } from '../config';

export default {
  data() {
    return {
      selectedFile: null,
      processing: false,
      downloadLink: null,
      fileName: '',
      error: null,
      currentStatus: '',
      completedPrompts: 0,
      currentStep: '',
    };
  },
  computed: {
    statusIcon() {
      switch(this.currentStatus) {
        case 'File caricato con successo':
          return 'fas fa-check-circle';
        case 'Analisi in corso':
          return 'fas fa-spinner fa-spin';
        case 'Analisi completata e pronta per il download':
          return 'fas fa-check-double';
        default:
          return '';
      }
    },
    progressPercentage() {
      // Inizia da 10% e poi avanza fino al 100%
      return Math.min(10 + (this.completedPrompts / 3) * 90, 100);
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
    },
    onFileDrop(event) {
      this.selectedFile = event.dataTransfer.files[0];
    },
    async uploadFile() {
      if (!this.selectedFile) {
        this.error = 'Nessun file selezionato';
        return;
      }

      this.processing = true;
      this.error = null;
      this.currentStatus = 'Caricamento in corso...';

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      try {
        console.log('Inizio upload del file:', this.selectedFile.name);
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        console.log('Risposta ricevuta:', response);

        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          const messages = chunk.split('\n\n');
          
          for (const message of messages) {
            if (message.startsWith('data: ')) {
              const data = JSON.parse(message.slice(5));
              console.log('Aggiornamento ricevuto:', data);
              this.currentStatus = data.message;
            }
          }
        }
        
        console.log('Elaborazione completata');
        // Gestisci il completamento (ad esempio, mostra il link per il download)
      } catch (error) {
        console.error('Errore durante l\'upload o l\'elaborazione:', error);
        this.error = `Errore: ${error.message}`;
      } finally {
        this.processing = false;
      }
    },
    async downloadFile() {
      console.log('Inizio download del file:', this.fileName);
      try {
        const url = `${API_URL}/api/download/${this.fileName}`;
        console.log('URL di download:', url);
        
        const response = await fetch(url);
        console.log('Risposta del download:', response);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Download completato con successo!');
      } catch (error) {
        console.error('Errore durante il download:', error);
      }
    }
  }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

body {
  background-color: #121212;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.sin-text {
  max-width: 600px;
  width: 100%;
  padding: 30px;
  background-color: #1e1e1e;
  color: #e0e0e0;
  font-family: 'Arial', sans-serif;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #ffffff;
  margin-bottom: 30px;
  font-size: 2.5em;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.upload-area {
  border: 2px dashed #4a4a4a;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  background-color: #2a2a2a;
}

.upload-area:hover {
  background-color: #333333;
}

.upload-area i {
  font-size: 48px;
  color: #808080;
  margin-bottom: 10px;
}

.file-input {
  display: none;
}

.file-name {
  margin-top: 10px;
  font-weight: bold;
  color: #b0b0b0;
}

.process-button {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #3a3a3a;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.process-button:hover:not(:disabled) {
  background-color: #4a4a4a;
}

.process-button:disabled {
  background-color: #2a2a2a;
  cursor: not-allowed;
}

.process-button i {
  margin-right: 10px;
}

.process-button[title]:hover::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  z-index: 1;
  pointer-events: none;
}

.status-message {
  margin-top: 20px;
  padding: 10px;
  background-color: #2a2a2a;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-message i {
  margin-right: 10px;
}

.download-link {
  margin-top: 20px;
  text-align: center;
}

.download-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4a4a4a;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.download-button:hover {
  background-color: #5a5a5a;
}

.error {
  margin-top: 20px;
  padding: 10px;
  background-color: #3a0000;
  color: #ff6b6b;
  border-radius: 5px;
  display: flex;
  align-items: center;
}

.error i {
  margin-right: 10px;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin-right: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.progress-bar-container {
  width: 100%;
  height: 10px;
  background-color: #2a2a2a;
  border-radius: 5px;
  margin-top: 20px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.5s ease-in-out;
}

.info-box {
  margin-top: 20px;
  padding: 15px;
  background-color: #2a2a2a;
  border-radius: 5px;
  font-size: 14px;
}

.info-box p {
  margin: 5px 0;
}

.info-box i {
  margin-right: 10px;
}
</style>