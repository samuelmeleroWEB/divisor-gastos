<script setup>
import { Trash2 } from 'lucide-vue-next'
import { useExpensesStore } from '@/stores/expenses'

const store = useExpensesStore()

function normalizePaidBy(paidBy) {
  return Array.isArray(paidBy)
    ? paidBy
    : paidBy
      ? [paidBy]
      : []
}

function personName(id) {
  const person = store.people.find((p) => p.id === id)
  return person ? person.name : 'Desconocido'
}

function payerNames(expense) {
  return normalizePaidBy(expense.paidBy)
    .map((id) => personName(id))
    .join(', ')
}

function amountPerPayer(expense) {
  const payers = normalizePaidBy(expense.paidBy)

  if (payers.length === 0) {
    return 0
  }

  return Number(expense.amount || 0) / payers.length
}

function formatMoney(value) {
  return Number(value ?? 0).toFixed(2) + ' €'
}
</script>

<template>
  <div class="expense-list">
    <div class="list-header">
      <h3>Gastos</h3>

      <span class="count">
        {{ store.expenses.length }}
      </span>
    </div>

    <p
      v-if="store.expenses.length === 0"
      class="empty"
    >
      Todavía no hay gastos registrados.
    </p>

    <ul v-else>
      <li
        v-for="expense in store.expenses"
        :key="expense.id"
      >
        <div class="expense-info">
          <div class="expense-top">
            <span class="description">
              {{ expense.description }}
            </span>

            <span class="amount">
              {{ formatMoney(expense.amount) }}
            </span>
          </div>

          <span class="meta">
            Pagado por {{ payerNames(expense) }}
          </span>

          <span
            v-if="normalizePaidBy(expense.paidBy).length > 1"
            class="split"
          >
            {{ formatMoney(amountPerPayer(expense)) }}
            por persona
          </span>
        </div>

        <button
          class="delete-button"
          type="button"
          title="Eliminar gasto"
          @click="store.removeExpense(expense.id)"
        >
          <Trash2 :size="17" />
        </button>
      </li>
    </ul>

    <div
      v-if="store.expenses.length > 0"
      class="total"
    >
      <span>Total</span>
      <strong>
        {{ formatMoney(store.totalExpenses) }}
      </strong>
    </div>
  </div>
</template>

<style scoped>
.expense-list {
  margin-top: 1.2rem;
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
  gap: 0.55rem;

  margin: 0;
  padding: 0;

  list-style: none;
}

li {
  display: flex;
  align-items: center;
  gap: 0.8rem;

  padding: 0.8rem 0.85rem;

  border: 1px solid #edf1f0;
  border-radius: 13px;

  background: #f8fafc;
}

.expense-info {
  display: flex;
  flex: 1;
  flex-direction: column;

  min-width: 0;
  gap: 0.2rem;
}

.expense-top {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.description {
  overflow: hidden;

  color: #1e293b;

  font-size: 0.92rem;
  font-weight: 700;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.amount {
  flex: 0 0 auto;

  color: #0f766e;

  font-size: 0.92rem;
  font-weight: 800;
}

.meta {
  color: #64748b;
  font-size: 0.78rem;
}

.split {
  color: #0f766e;
  font-size: 0.75rem;
}

.delete-button {
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;

  place-items: center;

  border: none;
  border-radius: 10px;

  background: transparent;
  color: #94a3b8;

  cursor: pointer;
}

.delete-button:hover {
  background: #fef2f2;
  color: #dc2626;
}

.total {
  display: flex;
  justify-content: space-between;

  margin-top: 0.8rem;
  padding-top: 0.8rem;

  border-top: 1px solid #e8ecef;

  color: #475569;
}

.total strong {
  color: #0f766e;
}
</style>