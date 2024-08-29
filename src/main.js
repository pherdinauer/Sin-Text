import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import axios from 'axios'

const app = createApp(App)

// Configurazione di axios per OpenRouter
const openRouterClient = axios.create({
  baseURL: 'https://api.openrouter.ai/api/v1',
  headers: {
    'Authorization': 'Bearer TUA_CHIAVE_API_QUI',
    'Content-Type': 'application/json'
  }
})

// Aggiungi il client OpenRouter come proprietà globale
app.config.globalProperties.$openRouter = {
  chat: async (messages) => {
    try {
      const response = await openRouterClient.post('/chat/completions', {
        model: 'anthropic/claude-3-sonnet-20240229',
        messages: messages
      })
      return response.data.choices[0].message.content
    } catch (error) {
      console.error('Errore nella chiamata a OpenRouter:', error)
      throw error
    }
  }
}

app.mount('#app')
