<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  ArrowRight,
  CircleCheck,
  Check,
  X,
} from 'lucide-vue-next'

import { useExpensesStore } from '@/stores/expenses'

const store = useExpensesStore()
const { t } = useI18n()

const openPaymentIndex = ref(null)
const paymentAmount = ref('')

function formatMoney(value) {
  return Number(value ?? 0).toFixed(2) + ' €'
}

function openPaymentForm(index, settlement) {
  openPaymentIndex.value = index
  paymentAmount.value = settlement.amount
}

function closePaymentForm() {
  openPaymentIndex.value = null
  paymentAmount.value = ''
}

function registerPartialPayment(settlement) {
  const amount = Number(paymentAmount.value)

  if (
    !Number.isFinite(amount) ||
    amount <= 0 ||
    amount > settlement.amount
  ) {
    return
  }

  store.registerPayment(
    settlement.fromId,
    settlement.toId,
    amount
  )

  closePaymentForm()
}

function markAsPaid(settlement) {
  store.settlePayment(
    settlement.fromId,
    settlement.toId,
    settlement.amount
  )

  closePaymentForm()
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
      {{ t('balance.empty') }}
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
                {{
                  t('balance.hasPaid', {
                    amount: formatMoney(balance.paid),
                  })
                }}
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
        <h4>
          {{ t('balance.settlementsTitle') }}
        </h4>

        <div
          v-if="store.settlements.length === 0"
          class="all-settled"
        >
          <CircleCheck :size="20" />

          <span>
            {{ t('balance.allSettled') }}
          </span>
        </div>

        <div
          v-else
          class="settlement-list"
        >
          <div
            v-for="(settlement, index) in store.settlements"
            :key="`${settlement.fromId}-${settlement.toId}`"
            class="settlement-wrapper"
          >
            <div class="settlement">
              <div class="settlement-people">
                <strong>{{ settlement.from }}</strong>

                <ArrowRight
                  class="arrow"
                  :size="17"
                />

                <strong>{{ settlement.to }}</strong>
              </div>

              <span class="settlement-amount">
                {{ formatMoney(settlement.amount) }}
              </span>

              <div class="settlement-actions">
                <button
                  type="button"
                  class="partial-button"
                  @click="openPaymentForm(index, settlement)"
                >
                  {{ t('balance.registerPayment') }}
                </button>

                <button
                  type="button"
                  class="paid-button"
                  @click="markAsPaid(settlement)"
                >
                  <Check :size="15" />
                  {{ t('balance.markAsPaid') }}
                </button>
              </div>
            </div>

            <div
              v-if="openPaymentIndex === index"
              class="payment-form"
            >
              <div class="payment-info">
                <span>
                  {{ t('balance.amountPaid') }}
                </span>

                <small>
                  {{
                    t('balance.pending', {
                      amount: formatMoney(settlement.amount),
                    })
                  }}
                </small>
              </div>

              <div class="payment-controls">
                <div class="amount-input">
                  <input
                    v-model="paymentAmount"
                    type="number"
                    min="0.01"
                    :max="settlement.amount"
                    step="0.01"
                    placeholder="0.00"
                    @keyup.enter="
                      registerPartialPayment(settlement)
                    "
                  />

                  <span>€</span>
                </div>

                <button
                  type="button"
                  class="confirm-button"
                  @click="registerPartialPayment(settlement)"
                >
                  <Check :size="17" />
                  {{ t('common.confirm') }}
                </button>

                <button
                  type="button"
                  class="cancel-button"
                  :title="t('common.cancel')"
                  @click="closePaymentForm"
                >
                  <X :size="18" />
                </button>
              </div>

              <p
                v-if="
                  Number(paymentAmount) >
                  settlement.amount
                "
                class="payment-error"
              >
                {{ t('balance.paymentTooHigh') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="store.paymentHistory.length > 0"
        class="history"
      >
        <h4>
          {{ t('balance.paymentHistory') }}
        </h4>

        <div class="history-list">
          <div
            v-for="payment in store.paymentHistory"
            :key="payment.id"
            class="history-item"
          >
            <div class="history-people">
              <span>{{ payment.from }}</span>

              <ArrowRight :size="14" />

              <span>{{ payment.to }}</span>
            </div>

            <strong>
              {{ formatMoney(payment.amount) }}
            </strong>
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

.settlements h4,
.history h4 {
  margin: 0 0 0.8rem;
  color: #334155;
  font-size: 0.92rem;
}

.settlement-list {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.settlement-wrapper {
  overflow: hidden;
  border: 1px solid #dceeea;
  border-radius: 14px;
  background: #f0fdfa;
}

.settlement {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem;
  color: #475569;
  font-size: 0.85rem;
}

.settlement-people {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.arrow {
  flex: 0 0 auto;
  color: #14b8a6;
}

.settlement-amount {
  padding: 0.35rem 0.55rem;
  border-radius: 9px;

  background: #fef2f2;
  color: #dc2626;

  font-size: 0.95rem;
  font-weight: 800;
}

.settlement-actions {
  display: flex;
  grid-column: 1 / -1;
  gap: 0.5rem;
}

.partial-button,
.paid-button,
.confirm-button,
.cancel-button {
  border: none;
  cursor: pointer;
  font: inherit;
}

.partial-button {
  padding: 0.55rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  background: white;
  color: #475569;
  font-size: 0.78rem;
  font-weight: 650;
}

.partial-button:hover {
  border-color: #14b8a6;
  color: #0f766e;
}

.paid-button {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.55rem 0.75rem;
  border-radius: 9px;
  background: #0f766e;
  color: white;
  font-size: 0.78rem;
  font-weight: 700;
}

.paid-button:hover {
  background: #115e59;
}

.payment-form {
  padding: 0.85rem;
  border-top: 1px solid #dceeea;
  background: white;
}

.payment-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.55rem;
  color: #475569;
  font-size: 0.8rem;
  font-weight: 650;
}

.payment-info small {
  color: #94a3b8;
  font-weight: 500;
}

.payment-controls {
  display: flex;
  gap: 0.5rem;
}

.amount-input {
  position: relative;
  flex: 1;
}

.amount-input input {
  width: 100%;
  padding: 0.65rem 2rem 0.65rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  outline: none;
}

.amount-input input:focus {
  border-color: #14b8a6;
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
}

.amount-input span {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 0.85rem;
}

.confirm-button {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0 0.8rem;
  border-radius: 10px;
  background: #0f766e;
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
}

.cancel-button {
  display: grid;
  width: 38px;
  place-items: center;
  border-radius: 10px;
  background: #f1f5f9;
  color: #64748b;
}

.payment-error {
  margin: 0.5rem 0 0;
  color: #dc2626;
  font-size: 0.75rem;
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

.history {
  margin-top: 1.3rem;
  padding-top: 1.2rem;
  border-top: 1px solid #e8ecef;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.7rem 0.8rem;
  border-radius: 10px;
  background: #f8fafc;
  color: #64748b;
  font-size: 0.8rem;
}

.history-people {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.history-item strong {
  color: #334155;
}

@media (max-width: 600px) {
  .settlement {
    grid-template-columns: 1fr;
  }

  .settlement-amount {
    grid-row: 2;
  }

  .settlement-actions {
    grid-column: auto;
    flex-direction: column;
  }

  .partial-button,
  .paid-button {
    justify-content: center;
    width: 100%;
  }

  .payment-controls {
    flex-wrap: wrap;
  }

  .amount-input {
    width: 100%;
    flex-basis: 100%;
  }

  .confirm-button {
    flex: 1;
    justify-content: center;
    min-height: 38px;
  }
}
</style>