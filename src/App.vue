<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Languages,
  Check,
} from 'lucide-vue-next'

import {
  hasSelectedLanguage,
  setLanguage,
} from '@/i18n'

const { t } = useI18n()

const languageSelected = ref(
  hasSelectedLanguage()
)

function chooseLanguage(language) {
  setLanguage(language)
  languageSelected.value = true
}
</script>

<template>
  <RouterView v-if="languageSelected" />

  <main
    v-else
    class="language-screen"
  >
    <div class="language-card">
      <div class="language-logo">
        <Languages
          :size="30"
          :stroke-width="1.8"
        />
      </div>

      <span class="brand">
        {{ t('app.name') }}
      </span>

      <h1>
        Elige tu idioma
      </h1>

      <p>
        Choose your language
      </p>

      <div class="language-options">
        <button
          type="button"
          class="language-option"
          @click="chooseLanguage('es')"
        >
          <div>
            <strong>Español</strong>

            <span>
              Continuar en español
            </span>
          </div>

          <Check :size="18" />
        </button>

        <button
          type="button"
          class="language-option"
          @click="chooseLanguage('en')"
        >
          <div>
            <strong>English</strong>

            <span>
              Continue in English
            </span>
          </div>

          <Check :size="18" />
        </button>
      </div>

      <small class="language-note">
        Podrás cambiar el idioma más tarde.
        <br />
        You can change the language later.
      </small>
    </div>
  </main>
</template>

<style scoped>
.language-screen {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 1.5rem;

  background:
    radial-gradient(
      circle at top left,
      rgba(20, 184, 166, 0.1),
      transparent 30rem
    ),
    #f5f7f8;
}

.language-card {
  width: min(440px, 100%);
  padding: 2.2rem;

  border: 1px solid #e2e8f0;
  border-radius: 24px;

  background: white;

  box-shadow:
    0 20px 50px
      rgba(15, 23, 42, 0.08);

  text-align: center;
}

.language-logo {
  display: grid;

  width: 58px;
  height: 58px;

  margin: 0 auto 1rem;

  place-items: center;

  border-radius: 18px;

  background: #ecfdf5;
  color: #0f766e;
}

.brand {
  display: block;

  margin-bottom: 1.8rem;

  color: #0f766e;

  font-size: 0.82rem;
  font-weight: 800;

  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.language-card h1 {
  margin: 0;

  color: #172033;

  font-size: 1.7rem;
  letter-spacing: -0.03em;
}

.language-card > p {
  margin: 0.35rem 0 1.6rem;

  color: #94a3b8;

  font-size: 0.95rem;
}

.language-options {
  display: flex;
  flex-direction: column;

  gap: 0.65rem;
}

.language-option {
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  padding: 0.9rem 1rem;

  border: 1px solid #e2e8f0;
  border-radius: 13px;

  background: #fff;
  color: #64748b;

  cursor: pointer;

  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    transform 0.15s ease;
}

.language-option:hover {
  transform: translateY(-1px);

  border-color: #14b8a6;
  background: #f0fdfa;
  color: #0f766e;
}

.language-option div {
  display: flex;
  flex-direction: column;

  text-align: left;
}

.language-option strong {
  color: #334155;
  font-size: 0.95rem;
}

.language-option span {
  margin-top: 0.1rem;

  color: #94a3b8;
  font-size: 0.75rem;
}

.language-note {
  display: block;

  margin-top: 1.4rem;

  color: #94a3b8;

  font-size: 0.72rem;
  line-height: 1.5;
}
</style>