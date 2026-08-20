<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'

import { useI18n } from 'vue-i18n'

import { ChevronDown, Plus, Pencil, Trash2, Check, X, UsersRound } from 'lucide-vue-next'

import { useExpensesStore } from '@/stores/expenses'

const store = useExpensesStore()
const { t } = useI18n()

const selectorRef = ref(null)

const isOpen = ref(false)
const creating = ref(false)
const editingId = ref(null)

const newGroupName = ref('')
const editName = ref('')

const newGroupInput = ref(null)
const editInput = ref(null)

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function closeMenu() {
  isOpen.value = false
  creating.value = false
  editingId.value = null
}

function handleClickOutside(event) {
  if (isOpen.value && selectorRef.value && !selectorRef.value.contains(event.target)) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleClickOutside)
})

async function startCreating() {
  creating.value = true
  newGroupName.value = ''

  await nextTick()

  newGroupInput.value?.focus()
}

function cancelCreating() {
  creating.value = false
  newGroupName.value = ''
}

function createGroup() {
  const name = newGroupName.value.trim()

  if (!name) return

  store.addGroup(name)

  newGroupName.value = ''
  creating.value = false
  isOpen.value = false
}

function selectGroup(id) {
  store.selectGroup(id)
  closeMenu()
}

async function startEditing(group) {
  editingId.value = group.id
  editName.value = group.name

  await nextTick()

  editInput.value?.focus()
  editInput.value?.select()
}

function cancelEditing() {
  editingId.value = null
  editName.value = ''
}

function saveGroupName(groupId) {
  const name = editName.value.trim()

  if (!name) return

  store.renameGroup(groupId, name)

  editingId.value = null
  editName.value = ''
}

function deleteGroup(group) {
  const confirmed = window.confirm(
    t('groups.deleteConfirm', {
      name: group.name,
    }),
  )

  if (!confirmed) return

  store.removeGroup(group.id)
}
</script>

<template>
  <div ref="selectorRef" class="group-selector">
    <button type="button" class="current-group" :class="{ open: isOpen }" @click="toggleMenu">
      <span class="group-icon">
        <UsersRound :size="18" />
      </span>

      <span class="current-info">
        <small>
          {{ t('groups.current') }}
        </small>

        <strong>
          {{ store.activeGroupName }}
        </strong>
      </span>

      <ChevronDown class="chevron" :class="{ rotated: isOpen }" :size="18" />
    </button>

    <div v-if="isOpen" class="dropdown">
      <div class="dropdown-header">
        <div>
          <span>
            {{ t('groups.myGroups') }}
          </span>

          <small>
            {{
              t('groups.count', {
                count: store.groups.length,
              })
            }}
          </small>
        </div>

        <button
          type="button"
          class="create-icon-button"
          :title="t('groups.create')"
          @click="startCreating"
        >
          <Plus :size="18" />
        </button>
      </div>

      <form v-if="creating" class="new-group" @submit.prevent="createGroup">
        <input
          ref="newGroupInput"
          v-model="newGroupName"
          type="text"
          maxlength="40"
          :placeholder="t('groups.namePlaceholder')"
        />

        <button
          type="submit"
          class="small-action confirm"
          :title="t('common.create')"
          :disabled="!newGroupName.trim()"
        >
          <Check :size="17" />
        </button>

        <button
          type="button"
          class="small-action cancel"
          :title="t('common.cancel')"
          @click="cancelCreating"
        >
          <X :size="17" />
        </button>
      </form>

      <div class="groups-list">
        <div
          v-for="group in store.groups"
          :key="group.id"
          class="group-row"
          :class="{
            active: group.id === store.activeGroupId,
          }"
        >
          <template v-if="editingId === group.id">
            <input
              ref="editInput"
              v-model="editName"
              class="rename-input"
              type="text"
              maxlength="40"
              @keyup.enter="saveGroupName(group.id)"
              @keyup.esc="cancelEditing"
            />

            <button
              type="button"
              class="small-action confirm"
              :title="t('common.save')"
              @click="saveGroupName(group.id)"
            >
              <Check :size="16" />
            </button>

            <button
              type="button"
              class="small-action cancel"
              :title="t('common.cancel')"
              @click="cancelEditing"
            >
              <X :size="16" />
            </button>
          </template>

          <template v-else>
            <button type="button" class="group-main" @click="selectGroup(group.id)">
              <span class="group-avatar">
                {{ group.name.charAt(0).toUpperCase() }}
              </span>

              <span class="group-details">
                <strong>
                  {{ group.name }}
                </strong>

                <small>
                  {{
                    t(
                      'groups.peopleCount',
                      { count: group.people?.length ?? 0 },
                      group.people?.length ?? 0,
                    )
                  }}
                  ·
                  {{
                    t(
                      'groups.expenseCount',
                      { count: group.expenses?.length ?? 0 },
                      group.expenses?.length ?? 0,
                    )
                  }}
                </small>
              </span>

              <span v-if="group.id === store.activeGroupId" class="active-dot"></span>
            </button>

            <div class="group-actions">
              <button type="button" :title="t('common.rename')" @click.stop="startEditing(group)">
                <Pencil :size="15" />
              </button>

              <button
                type="button"
                class="delete"
                :title="t('common.delete')"
                @click.stop="deleteGroup(group)"
              >
                <Trash2 :size="15" />
              </button>
            </div>
          </template>
        </div>
      </div>

      <button v-if="!creating" type="button" class="new-group-button" @click="startCreating">
        <Plus :size="17" />

        {{ t('groups.createNew') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.group-selector {
  position: relative;
  z-index: 20;
  width: min(320px, 100%);
}

.current-group {
  display: flex;
  align-items: center;
  gap: 0.65rem;

  width: 100%;
  padding: 0.6rem 0.7rem;

  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 14px;

  background: rgba(255, 255, 255, 0.12);
  color: white;

  cursor: pointer;

  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.current-group:hover,
.current-group.open {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.3);
}

.group-icon {
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.14);
}

.current-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  text-align: left;
}

.current-info small {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.68rem;
}

.current-info strong {
  overflow: hidden;
  font-size: 0.87rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chevron {
  flex: 0 0 auto;
  transition: transform 0.2s ease;
}

.chevron.rotated {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;

  top: calc(100% + 0.55rem);
  right: 0;

  width: min(360px, 100%);
  max-width: 100%;

  padding: 0.65rem;

  box-sizing: border-box;

  border: 1px solid #e2e8f0;
  border-radius: 16px;

  background: white;
  color: #334155;

  box-shadow:
    0 20px 50px rgba(15, 23, 42, 0.16),
    0 4px 12px rgba(15, 23, 42, 0.06);
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.35rem 0.35rem 0.65rem;
}

.dropdown-header > div {
  display: flex;
  flex-direction: column;
}

.dropdown-header span {
  font-size: 0.85rem;
  font-weight: 800;
}

.dropdown-header small {
  color: #94a3b8;
  font-size: 0.68rem;
}

.create-icon-button,
.small-action,
.group-actions button {
  display: grid;
  place-items: center;
  border: none;
  cursor: pointer;
}

.create-icon-button {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: #ecfdf5;
  color: #0f766e;
}

.groups-list {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  max-height: 300px;
  overflow-y: auto;
}

.group-row {
  display: flex;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 12px;

  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.group-row:hover {
  background: #f8fafc;
}

.group-row.active {
  border-color: #ccfbf1;
  background: #f0fdfa;
}

.group-main {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 0.65rem;

  min-width: 0;
  padding: 0.55rem;

  border: none;

  background: transparent;
  color: inherit;

  cursor: pointer;
}

.group-avatar {
  display: grid;

  width: 34px;
  height: 34px;

  flex: 0 0 auto;

  place-items: center;

  border-radius: 10px;

  background: #f1f5f9;
  color: #64748b;

  font-size: 0.78rem;
  font-weight: 800;
}

.group-row.active .group-avatar {
  background: #ccfbf1;
  color: #0f766e;
}

.group-details {
  display: flex;
  flex: 1;
  flex-direction: column;

  min-width: 0;

  text-align: left;
}

.group-details strong {
  overflow: hidden;
  color: #334155;
  font-size: 0.82rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.group-details small {
  color: #94a3b8;
  font-size: 0.67rem;
}

.active-dot {
  width: 7px;
  height: 7px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: #14b8a6;
}

.group-actions {
  display: flex;
  gap: 0.15rem;
  padding-right: 0.4rem;
}

.group-actions button {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: transparent;
  color: #94a3b8;
}

.group-actions button:hover {
  background: #f1f5f9;
  color: #475569;
}

.group-actions .delete:hover {
  background: #fef2f2;
  color: #dc2626;
}

.new-group {
  display: flex;
  gap: 0.35rem;

  margin-bottom: 0.45rem;
  padding: 0.4rem;

  border-radius: 11px;

  background: #f8fafc;
}

.new-group input,
.rename-input {
  flex: 1;

  min-width: 0;
  padding: 0.5rem 0.6rem;

  border: 1px solid #cbd5e1;
  border-radius: 8px;

  outline: none;

  font: inherit;
  font-size: 0.8rem;
}

.new-group input:focus,
.rename-input:focus {
  border-color: #14b8a6;

  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
}

.rename-input {
  margin: 0.4rem;
}

.small-action {
  width: 32px;
  flex: 0 0 auto;
  border-radius: 8px;
}

.small-action.confirm {
  background: #0f766e;
  color: white;
}

.small-action.confirm:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.small-action.cancel {
  background: #f1f5f9;
  color: #64748b;
}

.new-group-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;

  width: 100%;
  margin-top: 0.55rem;
  padding: 0.6rem;

  border: 1px dashed #cbd5e1;
  border-radius: 10px;

  background: transparent;
  color: #64748b;

  cursor: pointer;

  font-size: 0.78rem;
  font-weight: 700;
}

.new-group-button:hover {
  border-color: #14b8a6;
  background: #f0fdfa;
  color: #0f766e;
}
@media (max-width: 600px) {
  .group-selector {
    width: 100%;
    max-width: 100%;
  }

  .dropdown {
    left: 10px;
    right: 10px;

    width: auto;
    max-width: none;

    margin-top: 0.35rem;
    padding: 0.65rem;

    box-sizing: border-box;

    border-radius: 16px;
  }

  .current-group {
    width: 100%;
  }

  .group-row {
    min-width: 0;
  }

  .group-main {
    min-width: 0;
  }

  .group-details {
    min-width: 0;
  }

  .group-details strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dropdown-header {
    padding: 0.2rem 0.2rem 0.6rem;
  }

  .groups-list {
    gap: 0.4rem;
  }

  .new-group-button {
    margin-top: 0.65rem;
  }
}
</style>
