<script setup>
import { Trash2 } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { useExpensesStore } from '@/stores/expenses'

const store = useExpensesStore()
const { t } = useI18n()
</script>

<template>
  <div class="person-list">
    <div class="list-header">
      <h3>
        {{ t('people.groupPeople') }}
      </h3>

      <span class="count">
        {{ store.people?.length ?? 0 }}
      </span>
    </div>

    <p
      v-if="
        !store.people ||
        store.people.length === 0
      "
      class="empty"
    >
      {{ t('people.empty') }}
    </p>

    <ul v-else>
      <li
        v-for="person in store.people"
        :key="person.id"
      >
        <div class="person-info">
          <span class="avatar">
            {{ person.name.charAt(0).toUpperCase() }}
          </span>

          <span class="person-name">
            {{ person.name }}
          </span>
        </div>

        <button
          type="button"
          class="delete-button"
          :title="t('people.delete')"
          @click="store.removePerson(person.id)"
        >
          <Trash2 :size="17" />
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.person-list {
  margin-top: 1rem;
}

.list-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  margin-bottom: 0.7rem;
}

.list-header h3 {
  margin: 0;

  color: #334155;

  font-size: 0.9rem;
  font-weight: 750;
}

.count {
  display: grid;

  min-width: 24px;
  height: 24px;

  place-items: center;

  border-radius: 8px;

  background: #f1f5f9;
  color: #64748b;

  font-size: 0.75rem;
  font-weight: 700;
}

.empty {
  margin: 0;
  padding: 1rem;

  border: 1px dashed #dbe3e1;
  border-radius: 12px;

  color: #94a3b8;

  font-size: 0.88rem;
  text-align: center;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  margin: 0;
  padding: 0;

  list-style: none;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.7rem;

  padding: 0.65rem 0.75rem;

  border: 1px solid #edf1f0;
  border-radius: 12px;

  background: #f8fafc;
}

.person-info {
  display: flex;
  align-items: center;
  gap: 0.65rem;

  min-width: 0;
}

.avatar {
  display: grid;

  width: 32px;
  height: 32px;

  flex: 0 0 auto;

  place-items: center;

  border-radius: 10px;

  background: #ecfdf5;
  color: #0f766e;

  font-size: 0.78rem;
  font-weight: 800;
}

.person-name {
  overflow: hidden;

  color: #334155;

  font-size: 0.9rem;
  font-weight: 650;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-button {
  display: grid;

  width: 34px;
  height: 34px;

  flex: 0 0 auto;

  place-items: center;

  border: none;
  border-radius: 9px;

  background: transparent;
  color: #94a3b8;

  cursor: pointer;
}

.delete-button:hover {
  background: #fef2f2;
  color: #dc2626;
}
</style>