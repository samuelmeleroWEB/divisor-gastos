<script setup>
import { ref } from 'vue'
import { useExpensesStore } from '@/stores/expenses'

const store = useExpensesStore()
const name = ref('')

function handleSubmit() {
  store.addPerson(name.value)
  name.value = ''
}
</script>

<template>
  <form class="person-form" @submit.prevent="handleSubmit">
    <input
      v-model="name"
      type="text"
      placeholder="Nombre de la persona"
      required
    />
    <button type="submit">Añadir</button>
  </form>
</template>

<style scoped>
.person-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.person-form input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.person-form button {
  padding: 0.5rem 1rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.person-form button:hover {
  background-color: #369870;
}
</style>