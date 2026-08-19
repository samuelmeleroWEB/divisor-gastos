import { createI18n } from 'vue-i18n'

import es from './es'
import en from './en'

export const LANGUAGE_KEY = 'saldocero-language'

export function getSavedLanguage() {
  return localStorage.getItem(LANGUAGE_KEY)
}

export function hasSelectedLanguage() {
  return Boolean(getSavedLanguage())
}

const savedLanguage = getSavedLanguage()

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,

  locale: savedLanguage || 'es',
  fallbackLocale: 'es',

  messages: {
    es,
    en,
  },
})

export function setLanguage(language) {
  if (!['es', 'en'].includes(language)) {
    return
  }

  i18n.global.locale.value = language

  localStorage.setItem(
    LANGUAGE_KEY,
    language
  )

  document.documentElement.lang = language
}

document.documentElement.lang =
  savedLanguage || 'es'