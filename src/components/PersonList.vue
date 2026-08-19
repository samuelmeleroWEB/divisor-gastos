<script setup>
import { useExpensesStore } from '@/stores/expenses'

const store = useExpensesStore()
</script>

<template>
  <div class="person-list">
    <h3>Personas del grupo ({{ store.people?.length ?? 0 }})</h3>

    <p v-if="!store.people || store.people.length === 0" class="empty">
      Todavía no has añadido a nadie.
    </p>

    <ul v-else>
      <li v-for="person in store.people" :key="person.id">
        <span>{{ person.name }}</span>

        <button @click="store.removePerson(person.id)" title="Eliminar">
          ✕
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.person-list h3 {
  margin-bottom: 0.5rem;
}

.person-list .empty {
  color: #888;
  font-style: italic;
}

.person-list ul {
  list-style: none;
  padding: 0;
}

.person-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.6rem;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 0.3rem;
}

.person-list button {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-weight: bold;
}
</style>