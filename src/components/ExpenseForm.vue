<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Check, Plus } from 'lucide-vue-next'
import { useExpensesStore } from '@/stores/expenses'

const store = useExpensesStore()
const { t } = useI18n()

const description = ref('')
const amount = ref('')
const paidBy = ref([])

function togglePayer(personId) {
  if (paidBy.value.includes(personId)) {
    paidBy.value = paidBy.value.filter((id) => id !== personId)
  } else {
    paidBy.value.push(personId)
  }
}

function handleSubmit() {
  if (
    !description.value.trim() ||
    !amount.value ||
    paidBy.value.length === 0
  ) {
    return
  }

  store.addExpense(
    description.value,
    Number(amount.value),
    [...paidBy.value]
  )

  description.value = ''
  amount.value = ''
  paidBy.value = []
}
</script>

<template>
  <form class="expense-form" @submit.prevent="handleSubmit">
    <p
      v-if="store.people.length === 0"
      class="warning"
    >
      {{ t('expenses.needPerson') }}
    </p>

    <template v-else>
      <div class="fields">
        <input
          v-model="description"
          type="text"
          :placeholder="t('expenses.descriptionPlaceholder')"
          required
        />

        <input
          v-model="amount"
          type="number"
          step="0.01"
          min="0.01"
          :placeholder="t('expenses.amountPlaceholder')"
          required
        />
      </div>

      <div class="payer-section">
        <div class="payer-header">
          <span>
            {{ t('expenses.whoPaid') }}
          </span>

          <span class="selected-count">
            {{
              t(
                'expenses.selectedCount',
                { count: paidBy.length },
                paidBy.length
              )
            }}
          </span>
        </div>

        <div class="payer-list">
          <button
            v-for="person in store.people"
            :key="person.id"
            type="button"
            class="payer-option"
            :class="{ selected: paidBy.includes(person.id) }"
            @click="togglePayer(person.id)"
          >
            <span class="avatar">
              {{ person.name.charAt(0).toUpperCase() }}
            </span>

            <span class="payer-name">
              {{ person.name }}
            </span>

            <span class="check">
              <Check
                v-if="paidBy.includes(person.id)"
                :size="16"
                :stroke-width="2.5"
              />
            </span>
          </button>
        </div>

        <p
          v-if="paidBy.length > 1"
          class="split-info"
        >
          {{
            t(
              'expenses.splitBetween',
              { count: paidBy.length },
              paidBy.length
            )
          }}
        </p>
      </div>

      <button
        class="submit-button"
        type="submit"
        :disabled="paidBy.length === 0"
      >
        <Plus :size="18" />
        {{ t('expenses.addExpense') }}
      </button>
    </template>
  </form>
</template>

<style scoped>
.expense-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.3rem;
}

.fields {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 0.65rem;
}

.fields input {
  width: 100%;
  padding: 0.75rem 0.85rem;

  border: 1px solid #dbe3e1;
  border-radius: 12px;

  background: #ffffff;
  color: #172033;
}

.fields input:focus {
  border-color: #14b8a6;
}

.payer-section {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.payer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  color: #475569;
  font-size: 0.88rem;
  font-weight: 650;
}

.selected-count {
  color: #0f766e;
  font-size: 0.78rem;
}

.payer-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem;
}

.payer-option {
  display: flex;
  align-items: center;
  gap: 0.65rem;

  width: 100%;
  padding: 0.6rem 0.7rem;

  border: 1px solid #e2e8f0;
  border-radius: 12px;

  background: #ffffff;
  color: #334155;

  cursor: pointer;

  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    box-shadow 0.15s ease;
}

.payer-option:hover {
  border-color: #99d8cf;
}

.payer-option.selected {
  border-color: #14b8a6;
  background: #f0fdfa;
  box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.08);
}

.avatar {
  display: grid;
  width: 30px;
  height: 30px;
  flex: 0 0 auto;

  place-items: center;

  border-radius: 9px;

  background: #f1f5f9;
  color: #475569;

  font-size: 0.8rem;
  font-weight: 800;
}

.selected .avatar {
  background: #ccfbf1;
  color: #0f766e;
}

.payer-name {
  flex: 1;
  overflow: hidden;

  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.check {
  display: grid;
  width: 22px;
  height: 22px;

  place-items: center;

  border: 1px solid #cbd5e1;
  border-radius: 7px;

  color: white;
}

.selected .check {
  border-color: #0f766e;
  background: #0f766e;
}

.split-info {
  margin: 0;

  color: #64748b;

  font-size: 0.8rem;
}

.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;

  width: 100%;
  padding: 0.75rem 1rem;

  border: none;
  border-radius: 12px;

  background: #0f766e;
  color: white;

  font-weight: 700;
  cursor: pointer;
}

.submit-button:hover:not(:disabled) {
  background: #115e59;
}

.submit-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.warning {
  margin: 0;
  padding: 0.8rem 1rem;

  border-radius: 12px;

  background: #fff7ed;
  color: #c2410c;

  font-size: 0.9rem;
}

@media (max-width: 520px) {
  .fields,
  .payer-list {
    grid-template-columns: 1fr;
  }
}
</style>