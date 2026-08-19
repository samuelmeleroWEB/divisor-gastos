import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExpensesStore = defineStore(
  'expenses',
  () => {
    // ---------- STATE ----------
    const people = ref([])
    const expenses = ref([])

    // ---------- HELPERS ----------

    function normalizePaidBy(paidBy) {
      if (Array.isArray(paidBy)) {
        return paidBy
      }

      if (paidBy) {
        return [paidBy]
      }

      return []
    }

    // ---------- PERSONAS ----------

    function addPerson(name) {
      if (!name || !name.trim()) return

      people.value.push({
        id: crypto.randomUUID(),
        name: name.trim(),
      })
    }

    function removePerson(id) {
      people.value = people.value.filter((person) => person.id !== id)

      // Quitamos a esa persona de los gastos en los que participó como pagador
      expenses.value = expenses.value
        .map((expense) => {
          const paidBy = normalizePaidBy(expense.paidBy)
          const remainingPayers = paidBy.filter(
            (personId) => personId !== id
          )

          return {
            ...expense,
            paidBy: remainingPayers,
          }
        })
        .filter((expense) => expense.paidBy.length > 0)
    }

    // ---------- GASTOS ----------

    function addExpense(description, amount, paidBy) {
      const parsedAmount = Number(amount)
      const payers = normalizePaidBy(paidBy)

      if (
        !description ||
        !description.trim() ||
        !Number.isFinite(parsedAmount) ||
        parsedAmount <= 0 ||
        payers.length === 0
      ) {
        return
      }

      expenses.value.push({
        id: crypto.randomUUID(),
        description: description.trim(),
        amount: parsedAmount,
        paidBy: payers,
      })
    }

    function removeExpense(id) {
      expenses.value = expenses.value.filter(
        (expense) => expense.id !== id
      )
    }

    // ---------- GETTERS ----------

    const totalExpenses = computed(() => {
      return expenses.value.reduce(
        (sum, expense) => sum + Number(expense.amount || 0),
        0
      )
    })

    const sharePerPerson = computed(() => {
      if (people.value.length === 0) {
        return 0
      }

      return totalExpenses.value / people.value.length
    })

    const balances = computed(() => {
      return people.value.map((person) => {
        let paid = 0

        expenses.value.forEach((expense) => {
          const payers = normalizePaidBy(expense.paidBy)

          if (payers.includes(person.id)) {
            paid += Number(expense.amount || 0) / payers.length
          }
        })

        const balance = paid - sharePerPerson.value

        return {
          id: person.id,
          name: person.name,
          paid,
          balance,
        }
      })
    })

    const settlements = computed(() => {
      const debtors = balances.value
        .filter((person) => person.balance < -0.01)
        .map((person) => ({ ...person }))

      const creditors = balances.value
        .filter((person) => person.balance > 0.01)
        .map((person) => ({ ...person }))

      const result = []

      let debtorIndex = 0
      let creditorIndex = 0

      while (
        debtorIndex < debtors.length &&
        creditorIndex < creditors.length
      ) {
        const debtor = debtors[debtorIndex]
        const creditor = creditors[creditorIndex]

        const amount = Math.min(
          -debtor.balance,
          creditor.balance
        )

        result.push({
          from: debtor.name,
          to: creditor.name,
          amount: Math.round(amount * 100) / 100,
        })

        debtor.balance += amount
        creditor.balance -= amount

        if (Math.abs(debtor.balance) < 0.01) {
          debtorIndex++
        }

        if (Math.abs(creditor.balance) < 0.01) {
          creditorIndex++
        }
      }

      return result
    })

    return {
      people,
      expenses,

      addPerson,
      removePerson,

      addExpense,
      removeExpense,

      totalExpenses,
      sharePerPerson,
      balances,
      settlements,
    }
  },
  {
    persist: true,
  }
)