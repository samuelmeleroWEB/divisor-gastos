import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExpensesStore = defineStore(
  'expenses',
  () => {
    // ---------- HELPERS GENERALES ----------

    function createId() {
      return crypto.randomUUID()
    }

    function createEmptyGroup(name = 'Mi grupo') {
      return {
        id: createId(),
        name: name.trim() || 'Mi grupo',
        people: [],
        expenses: [],
        payments: [],
        createdAt: new Date().toISOString(),
      }
    }

    function normalizePaidBy(paidBy) {
      if (Array.isArray(paidBy)) {
        return paidBy
      }

      if (paidBy) {
        return [paidBy]
      }

      return []
    }

    function roundMoney(value) {
      const number = Number(value)

      if (!Number.isFinite(number)) {
        return 0
      }

      const rounded =
        Math.round((number + Number.EPSILON) * 100) / 100

      return Math.abs(rounded) < 0.01 ? 0 : rounded
    }

    // ---------- MIGRACIÓN ----------
    // Intenta conservar los datos del sistema anterior,
    // donde people, expenses y payments estaban en la raíz.

    function getInitialState() {
      const fallbackGroup = createEmptyGroup('Mi grupo')

      if (typeof window === 'undefined') {
        return {
          groups: [fallbackGroup],
          activeGroupId: fallbackGroup.id,
        }
      }

      try {
        const saved = localStorage.getItem('expenses')

        if (!saved) {
          return {
            groups: [fallbackGroup],
            activeGroupId: fallbackGroup.id,
          }
        }

        const parsed = JSON.parse(saved)

        // Ya utiliza el nuevo sistema de grupos
        if (
          Array.isArray(parsed.groups) &&
          parsed.groups.length > 0
        ) {
          const validActiveGroup =
            parsed.groups.some(
              (group) =>
                group.id === parsed.activeGroupId
            )

          return {
            groups: parsed.groups,
            activeGroupId: validActiveGroup
              ? parsed.activeGroupId
              : parsed.groups[0].id,
          }
        }

        // Formato antiguo: migramos sus datos a un primer grupo
        if (
          Array.isArray(parsed.people) ||
          Array.isArray(parsed.expenses) ||
          Array.isArray(parsed.payments)
        ) {
          const migratedGroup = {
            id: createId(),
            name: 'Mi grupo',
            people: Array.isArray(parsed.people)
              ? parsed.people
              : [],
            expenses: Array.isArray(parsed.expenses)
              ? parsed.expenses
              : [],
            payments: Array.isArray(parsed.payments)
              ? parsed.payments
              : [],
            createdAt: new Date().toISOString(),
          }

          return {
            groups: [migratedGroup],
            activeGroupId: migratedGroup.id,
          }
        }
      } catch (error) {
        console.warn(
          'No se pudieron recuperar los datos guardados:',
          error
        )
      }

      return {
        groups: [fallbackGroup],
        activeGroupId: fallbackGroup.id,
      }
    }

    // ---------- STATE ----------

    const initialState = getInitialState()

    const groups = ref(initialState.groups)
    const activeGroupId = ref(
      initialState.activeGroupId
    )

    // ---------- GRUPO ACTIVO ----------

    const activeGroup = computed(() => {
      return (
        groups.value.find(
          (group) =>
            group.id === activeGroupId.value
        ) ?? groups.value[0] ?? null
      )
    })

    const activeGroupName = computed(() => {
      return activeGroup.value?.name ?? ''
    })

    /*
     * Gracias a estos computed, los componentes antiguos
     * pueden seguir utilizando:
     *
     * store.people
     * store.expenses
     * store.payments
     *
     * sin saber nada de los grupos.
     */

    const people = computed(() => {
      return activeGroup.value?.people ?? []
    })

    const expenses = computed(() => {
      return activeGroup.value?.expenses ?? []
    })

    const payments = computed(() => {
      return activeGroup.value?.payments ?? []
    })

    // ---------- GRUPOS ----------

    function addGroup(name) {
      if (!name || !name.trim()) {
        return false
      }

      const newGroup = createEmptyGroup(name)

      groups.value.push(newGroup)
      activeGroupId.value = newGroup.id

      return true
    }

    function selectGroup(id) {
      const exists = groups.value.some(
        (group) => group.id === id
      )

      if (!exists) {
        return false
      }

      activeGroupId.value = id

      return true
    }

    function renameGroup(id, newName) {
      if (!newName || !newName.trim()) {
        return false
      }

      const group = groups.value.find(
        (item) => item.id === id
      )

      if (!group) {
        return false
      }

      group.name = newName.trim()

      return true
    }

    function removeGroup(id) {
      const index = groups.value.findIndex(
        (group) => group.id === id
      )

      if (index === -1) {
        return false
      }

      groups.value.splice(index, 1)

      // Si hemos borrado todos los grupos,
      // creamos automáticamente uno nuevo.
      if (groups.value.length === 0) {
        const newGroup = createEmptyGroup(
          'Mi grupo'
        )

        groups.value.push(newGroup)
        activeGroupId.value = newGroup.id

        return true
      }

      // Si hemos borrado el grupo que estaba abierto,
      // abrimos otro.
      if (activeGroupId.value === id) {
        const nextGroup =
          groups.value[
            Math.min(
              index,
              groups.value.length - 1
            )
          ]

        activeGroupId.value =
          nextGroup.id
      }

      return true
    }

    // ---------- PERSONAS ----------

    function getPersonById(id) {
      return people.value.find(
        (person) => person.id === id
      )
    }

    function addPerson(name) {
      if (
        !activeGroup.value ||
        !name ||
        !name.trim()
      ) {
        return
      }

      activeGroup.value.people.push({
        id: createId(),
        name: name.trim(),
      })
    }

    function removePerson(id) {
      if (!activeGroup.value) return

      activeGroup.value.people =
        activeGroup.value.people.filter(
          (person) => person.id !== id
        )

      activeGroup.value.expenses =
        activeGroup.value.expenses
          .map((expense) => {
            const paidBy =
              normalizePaidBy(
                expense.paidBy
              )

            const remainingPayers =
              paidBy.filter(
                (personId) =>
                  personId !== id
              )

            return {
              ...expense,
              paidBy:
                remainingPayers,
            }
          })
          .filter(
            (expense) =>
              expense.paidBy.length > 0
          )

      // Si cambia la composición del grupo,
      // los pagos anteriores dejan de representar
      // correctamente el nuevo reparto.
      activeGroup.value.payments = []
    }

    // ---------- GASTOS ----------

    function addExpense(
      description,
      amount,
      paidBy
    ) {
      if (!activeGroup.value) return

      const parsedAmount =
        roundMoney(amount)

      const payers =
        normalizePaidBy(paidBy)

      if (
        !description ||
        !description.trim() ||
        parsedAmount <= 0 ||
        payers.length === 0
      ) {
        return
      }

      activeGroup.value.expenses.push({
        id: createId(),
        description:
          description.trim(),
        amount: parsedAmount,
        paidBy: payers,
      })
    }

    function removeExpense(id) {
      if (!activeGroup.value) return

      activeGroup.value.expenses =
        activeGroup.value.expenses.filter(
          (expense) =>
            expense.id !== id
        )

      // Los pagos registrados correspondían
      // al reparto anterior.
      activeGroup.value.payments = []
    }

    // ---------- PAGOS ----------

    function clearPayments() {
      if (!activeGroup.value) return

      activeGroup.value.payments = []
    }

    function registerPayment(
      fromId,
      toId,
      amount
    ) {
      if (!activeGroup.value) {
        return false
      }

      const parsedAmount =
        roundMoney(amount)

      if (
        !fromId ||
        !toId ||
        fromId === toId ||
        parsedAmount <= 0
      ) {
        return false
      }

      const fromPerson =
        getPersonById(fromId)

      const toPerson =
        getPersonById(toId)

      if (!fromPerson || !toPerson) {
        return false
      }

      activeGroup.value.payments.push({
        id: createId(),
        fromId,
        toId,
        amount: parsedAmount,
        createdAt:
          new Date().toISOString(),
      })

      return true
    }

    function settlePayment(
      fromId,
      toId,
      amount
    ) {
      return registerPayment(
        fromId,
        toId,
        amount
      )
    }

    function removePayment(id) {
      if (!activeGroup.value) return

      activeGroup.value.payments =
        activeGroup.value.payments.filter(
          (payment) =>
            payment.id !== id
        )
    }

    // ---------- GETTERS ----------

    const totalExpenses = computed(() => {
      const total =
        expenses.value.reduce(
          (sum, expense) =>
            sum +
            Number(
              expense.amount || 0
            ),
          0
        )

      return roundMoney(total)
    })

    const sharePerPerson =
      computed(() => {
        if (
          people.value.length === 0
        ) {
          return 0
        }

        return (
          totalExpenses.value /
          people.value.length
        )
      })

    // ---------- BALANCE DE GASTOS ----------

    const expenseBalances =
      computed(() => {
        return people.value.map(
          (person) => {
            let paid = 0

            expenses.value.forEach(
              (expense) => {
                const payers =
                  normalizePaidBy(
                    expense.paidBy
                  )

                if (
                  payers.includes(
                    person.id
                  ) &&
                  payers.length > 0
                ) {
                  paid +=
                    Number(
                      expense.amount ||
                        0
                    ) /
                    payers.length
                }
              }
            )

            const balance =
              paid -
              sharePerPerson.value

            return {
              id: person.id,
              name: person.name,
              paid: roundMoney(paid),
              balance:
                roundMoney(balance),
            }
          }
        )
      })

    // ---------- BALANCE DESPUÉS DE PAGOS ----------

    const balances = computed(() => {
      return expenseBalances.value.map(
        (person) => {
          let adjustedBalance =
            person.balance

          payments.value.forEach(
            (payment) => {
              const amount =
                roundMoney(
                  payment.amount || 0
                )

              if (
                payment.fromId ===
                person.id
              ) {
                adjustedBalance +=
                  amount
              }

              if (
                payment.toId ===
                person.id
              ) {
                adjustedBalance -=
                  amount
              }
            }
          )

          return {
            ...person,
            balance:
              roundMoney(
                adjustedBalance
              ),
          }
        }
      )
    })

    // ---------- LIQUIDACIONES ----------

    const settlements = computed(() => {
      const debtors =
        balances.value
          .filter(
            (person) =>
              person.balance < -0.01
          )
          .map((person) => ({
            ...person,
            balance:
              roundMoney(
                person.balance
              ),
          }))

      const creditors =
        balances.value
          .filter(
            (person) =>
              person.balance > 0.01
          )
          .map((person) => ({
            ...person,
            balance:
              roundMoney(
                person.balance
              ),
          }))

      const result = []

      let debtorIndex = 0
      let creditorIndex = 0

      while (
        debtorIndex <
          debtors.length &&
        creditorIndex <
          creditors.length
      ) {
        const debtor =
          debtors[debtorIndex]

        const creditor =
          creditors[
            creditorIndex
          ]

        const amount =
          roundMoney(
            Math.min(
              -debtor.balance,
              creditor.balance
            )
          )

        if (amount <= 0) {
          break
        }

        result.push({
          fromId: debtor.id,
          from: debtor.name,

          toId: creditor.id,
          to: creditor.name,

          amount,
        })

        debtor.balance =
          roundMoney(
            debtor.balance +
              amount
          )

        creditor.balance =
          roundMoney(
            creditor.balance -
              amount
          )

        if (
          Math.abs(
            debtor.balance
          ) < 0.01
        ) {
          debtor.balance = 0
          debtorIndex++
        }

        if (
          Math.abs(
            creditor.balance
          ) < 0.01
        ) {
          creditor.balance = 0
          creditorIndex++
        }
      }

      return result
    })

    // ---------- HISTORIAL ----------

    const paymentHistory =
      computed(() => {
        return payments.value
          .map((payment) => {
            const from =
              getPersonById(
                payment.fromId
              )

            const to =
              getPersonById(
                payment.toId
              )

            return {
              ...payment,

              amount:
                roundMoney(
                  payment.amount
                ),

              from: from
                ? from.name
                : 'Desconocido',

              to: to
                ? to.name
                : 'Desconocido',
            }
          })
          .sort((a, b) =>
            b.createdAt.localeCompare(
              a.createdAt
            )
          )
      })

    // ---------- RETURN ----------

    return {
      // GRUPOS
      groups,
      activeGroupId,
      activeGroup,
      activeGroupName,

      addGroup,
      selectGroup,
      renameGroup,
      removeGroup,

      // DATOS DEL GRUPO ACTIVO
      people,
      expenses,
      payments,

      // PERSONAS
      addPerson,
      removePerson,

      // GASTOS
      addExpense,
      removeExpense,

      // PAGOS
      registerPayment,
      settlePayment,
      removePayment,
      clearPayments,

      // GETTERS
      totalExpenses,
      sharePerPerson,
      expenseBalances,
      balances,
      settlements,
      paymentHistory,
    }
  },
  {
    persist: true,
  }
)