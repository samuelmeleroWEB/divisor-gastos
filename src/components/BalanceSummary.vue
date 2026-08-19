<script setup>
import {
  ArrowRight,
  CircleCheck,
} from 'lucide-vue-next'

import { useExpensesStore } from '@/stores/expenses'

const store = useExpensesStore()

function formatMoney(value) {
  return Number(value ?? 0).toFixed(2) + ' €'
}
</script>

<template>
  <div class="balance-summary">
    <p
      v-if="
        store.people.length === 0 ||
        store.expenses.length === 0
      "
      class="empty"
    >
      Añade personas y gastos para ver el resumen.
    </p>

    <template v-else>
      <div class="balances">
        <div
          v-for="balance in store.balances"
          :key="balance.id"
          class="balance-item"
        >
          <div class="person">
            <span class="avatar">
              {{ balance.name.charAt(0).toUpperCase() }}
            </span>

            <div>
              <strong>{{ balance.name }}</strong>

              <span>
                Ha pagado {{ formatMoney(balance.paid) }}
              </span>
            </div>
          </div>

          <span
            class="balance-value"
            :class="{
              positive: balance.balance > 0.01,
              negative: balance.balance < -0.01,
              neutral:
                balance.balance >= -0.01 &&
                balance.balance <= 0.01,
            }"
          >
            {{ balance.balance > 0.01 ? '+' : '' }}
            {{ formatMoney(balance.balance) }}
          </span>
        </div>
      </div>

      <div class="settlements">
        <h4>Pagos para saldar cuentas</h4>

        <div
          v-if="store.settlements.length === 0"
          class="all-settled"
        >
          <CircleCheck :size="20" />

          <span>
            Todas las cuentas están saldadas.
          </span>
        </div>

        <div
          v-else
          class="settlement-list"
        >
          <div
            v-for="(settlement, index) in store.settlements"
            :key="index"
            class="settlement"
          >
            <strong>{{ settlement.from }}</strong>

            <ArrowRight
              class="arrow"
              :size="17"
            />

            <strong>{{ settlement.to }}</strong>

            <span class="settlement-amount">
              {{ formatMoney(settlement.amount) }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.balance-summary {
  width: 100%;
}

.empty {
  margin: 0;
  padding: 1.2rem;

  border: 1px dashed #dbe3e1;
  border-radius: 14px;

  color: #94a3b8;

  text-align: center;
}

.balances {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(220px, 1fr)
  );
  gap: 0.7rem;
}

.balance-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  padding: 0.85rem;

  border: 1px solid #edf1f0;
  border-radius: 14px;

  background: #f8fafc;
}

.person {
  display: flex;
  align-items: center;
  gap: 0.7rem;

  min-width: 0;
}

.avatar {
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 auto;

  place-items: center;

  border-radius: 11px;

  background: #ecfdf5;
  color: #0f766e;

  font-weight: 800;
}

.person div {
  display: flex;
  flex-direction: column;

  min-width: 0;
}

.person strong {
  color: #1e293b;
  font-size: 0.9rem;
}

.person span {
  color: #94a3b8;
  font-size: 0.72rem;
}

.balance-value {
  flex: 0 0 auto;

  padding: 0.35rem 0.55rem;

  border-radius: 9px;

  font-size: 0.82rem;
  font-weight: 800;
}

.positive {
  background: #ecfdf5;
  color: #15803d;
}

.negative {
  background: #fef2f2;
  color: #dc2626;
}

.neutral {
  background: #f1f5f9;
  color: #64748b;
}

.settlements {
  margin-top: 1.3rem;
  padding-top: 1.2rem;

  border-top: 1px solid #e8ecef;
}

.settlements h4 {
  margin: 0 0 0.8rem;

  color: #334155;

  font-size: 0.92rem;
}

.settlement-list {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.settlement {
  display: flex;
  align-items: center;
  gap: 0.55rem;

  padding: 0.75rem 0.85rem;

  border-radius: 12px;

  background: #f0fdfa;

  color: #475569;

  font-size: 0.85rem;
}

.arrow {
  color: #14b8a6;
}

.settlement-amount {
  margin-left: auto;

  color: #0f766e;

  font-weight: 800;
}

.all-settled {
  display: flex;
  align-items: center;
  gap: 0.6rem;

  padding: 0.85rem 1rem;

  border-radius: 12px;

  background: #ecfdf5;
  color: #15803d;

  font-size: 0.88rem;
  font-weight: 650;
}

@media (max-width: 520px) {
  .settlement {
    flex-wrap: wrap;
  }

  .settlement-amount {
    width: 100%;
    margin-left: 0;
    padding-left: 1.4rem;
  }
}
</style>