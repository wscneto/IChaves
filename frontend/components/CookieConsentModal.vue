<template>
  <div v-if="showModal" class="cookie-consent-overlay">
    <div class="cookie-consent-modal">
      <div class="cookie-consent-header">
        <h3>🍪 Política de Cookies</h3>
      </div>
      
      <div class="cookie-consent-content">
        <p>Este site utiliza cookies para melhorar sua experiência de navegação e garantir a segurança da sua autenticação.</p>
        
        <div class="cookie-types">
          <div class="cookie-type">
            <strong>Cookies Essenciais:</strong>
            <p>Necessários para autenticação e segurança (não podem ser desativados)</p>
          </div>
          
          <div class="cookie-type">
            <strong>Cookies de Sessão:</strong>
            <p>Mantêm você conectado durante sua visita</p>
          </div>
        </div>
        
        <div class="cookie-warning">
          <p>⚠️ Ao aceitar, você concorda com o uso de cookies essenciais para o funcionamento do sistema.</p>
        </div>
      </div>
      
      <div class="cookie-consent-actions">
        <button @click="declineCookies" class="btn-decline">
          Recusar e Sair
        </button>
        <button @click="acceptCookies" class="btn-accept">
          Aceitar Cookies
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const showModal = ref(false)
const router = useRouter()

const COOKIE_CONSENT_KEY = 'cookie_consent_accepted'

onMounted(() => {
  // Verifica se o usuário já aceitou os cookies
  const consentGiven = localStorage.getItem(COOKIE_CONSENT_KEY)
  if (!consentGiven) {
    showModal.value = true
  }
})

const acceptCookies = () => {
  localStorage.setItem(COOKIE_CONSENT_KEY, 'true')
  showModal.value = false
  // Emite evento para o sistema saber que cookies foram aceitos
  window.dispatchEvent(new CustomEvent('cookiesAccepted'))
}

const declineCookies = () => {
  // Se o usuário recusar, redireciona para página externa
  localStorage.removeItem(COOKIE_CONSENT_KEY)
  showModal.value = false
  // Redireciona para página externa (como o login do sistema original)
  window.location.href = 'https://pisic.vercel.app/'
}
</script>

<style scoped>
.cookie-consent-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.cookie-consent-modal {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.cookie-consent-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.cookie-consent-header h3 {
  color: #333;
  font-size: 1.5rem;
  margin: 0;
}

.cookie-consent-content {
  margin-bottom: 2rem;
}

.cookie-consent-content p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.cookie-types {
  margin: 1.5rem 0;
}

.cookie-type {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.cookie-type strong {
  color: #333;
  display: block;
  margin-bottom: 0.25rem;
}

.cookie-type p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.cookie-warning {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

.cookie-warning p {
  margin: 0;
  color: #856404;
  font-weight: 500;
}

.cookie-consent-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-accept, .btn-decline {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.btn-accept {
  background: #28a745;
  color: white;
}

.btn-accept:hover {
  background: #218838;
  transform: translateY(-1px);
}

.btn-decline {
  background: #6c757d;
  color: white;
}

.btn-decline:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

@media (max-width: 480px) {
  .cookie-consent-modal {
    padding: 1.5rem;
  }
  
  .cookie-consent-actions {
    flex-direction: column;
  }
  
  .btn-accept, .btn-decline {
    width: 100%;
  }
}
</style>