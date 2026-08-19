<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { UserPlus } from 'lucide-vue-next'

import { useExpensesStore } from '@/stores/expenses'

const store = useExpensesStore()
const { t } = useI18n()

const name = ref('')

function handleSubmit() {
  store.addPerson(name.value)
  name.value = ''
}
</script>

<template>
  <form
    class="person-form"
    @submit.prevent="handleSubmit"
  >
    <input
      v-model="name"
      type="text"
      :placeholder="t('people.namePlaceholder')"
      required
    />

    <button type="submit">
      <UserPlus :size="17" />
      {{ t('people.add') }}
    </button>
  </form>
</template>

<style scoped>
.person-form {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.person-form input {
  flex: 1;

  min-width: 0;
  padding: 0.7rem 0.8rem;

  border: 1px solid #dbe3e1;
  border-radius: 11px;

  background: white;
  color: #172033;
}

.person-form input:focus {
  border-color: #14b8a6;
}

.person-form button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;

  padding: 0.7rem 0.9rem;

  border: none;
  border-radius: 11px;

  background: #0f766e;
  color: white;

  cursor: pointer;

  font-weight: 700;
}

.person-form button:hover {
  background: #115e59;
}

@media (max-width: 480px) {
  .person-form {
    flex-direction: column;
  }

  .person-form button {
    width: 100%;
  }
}
</style>