<script setup>
import {
  WalletCards,
  Users,
  ReceiptText,
  Scale,
  Languages,
} from 'lucide-vue-next'

import { useI18n } from 'vue-i18n'
import { useExpensesStore } from '@/stores/expenses'
import { setLanguage } from '@/i18n'

import GroupSelector from '@/components/GroupSelector.vue'
import PersonForm from '@/components/PersonForm.vue'
import PersonList from '@/components/PersonList.vue'
import ExpenseForm from '@/components/ExpenseForm.vue'
import ExpenseList from '@/components/ExpenseList.vue'
import BalanceSummary from '@/components/BalanceSummary.vue'

const store = useExpensesStore()

const { t, locale } = useI18n()

function changeLanguage(language) {
  setLanguage(language)
}
</script>

<template>
  <main class="home">
    <header class="hero">
      <div class="hero-top">
        <div class="brand">
          <div class="brand-icon">
            <WalletCards
              :size="30"
              :stroke-width="1.8"
            />
          </div>

          <div>
            <h1>{{ t('app.name') }}</h1>

            <p>
              {{ t('home.subtitle') }}
            </p>
          </div>
        </div>

        <div class="hero-actions">
          <div class="language-switcher">
            <Languages
              :size="17"
              :stroke-width="2"
            />

            <button
              type="button"
              :class="{ active: locale === 'es' }"
              @click="changeLanguage('es')"
            >
              ES
            </button>

            <span>/</span>

            <button
              type="button"
              :class="{ active: locale === 'en' }"
              @click="changeLanguage('en')"
            >
              EN
            </button>
          </div>

          <GroupSelector />
        </div>
      </div>

      <div class="active-group-banner">
        <span>
          {{ t('home.managing') }}
        </span>

        <strong>
          {{ store.activeGroupName }}
        </strong>
      </div>
    </header>

    <div class="grid">
      <section class="card">
        <div class="section-heading">
          <div class="section-icon">
            <Users
              :size="21"
              :stroke-width="2"
            />
          </div>

          <div>
            <span class="eyebrow">
              {{ t('home.group') }}
            </span>

            <h2>
              {{ t('home.people') }}
            </h2>
          </div>
        </div>

        <PersonForm />
        <PersonList />
      </section>

      <section class="card">
        <div class="section-heading">
          <div class="section-icon">
            <ReceiptText
              :size="21"
              :stroke-width="2"
            />
          </div>

          <div>
            <span class="eyebrow">
              {{ t('home.movements') }}
            </span>

            <h2>
              {{ t('home.expenses') }}
            </h2>
          </div>
        </div>

        <ExpenseForm />
        <ExpenseList />
      </section>

      <section class="card summary-card">
        <div class="section-heading">
          <div class="section-icon">
            <Scale
              :size="21"
              :stroke-width="2"
            />
          </div>

          <div>
            <span class="eyebrow">
              {{ t('home.result') }}
            </span>

            <h2>
              {{
                t('home.balanceOf', {
                  group: store.activeGroupName,
                })
              }}
            </h2>
          </div>
        </div>

        <BalanceSummary />
      </section>
    </div>

    <footer class="footer">
      <span>{{ t('app.name') }}</span>

      <span class="footer-separator">
        ·
      </span>

      <span>
        {{ t('app.tagline') }}
      </span>
    </footer>
  </main>
</template>

<style scoped>
.home {
  width: min(
    1120px,
    calc(100% - 2rem)
  );

  margin: 0 auto;
  padding: 3rem 0 2rem;
}

/* HERO */

.hero {
  position: relative;

  margin-bottom: 2rem;
  padding: 2.5rem;

  border-radius: 28px;

  background:
    radial-gradient(
      circle at top right,
      rgba(255, 255, 255, 0.16),
      transparent 35%
    ),
    linear-gradient(
      135deg,
      #0f766e 0%,
      #115e59 100%
    );

  color: white;

  box-shadow:
    0 18px 40px
      rgba(15, 118, 110, 0.16),
    0 2px 8px
      rgba(15, 23, 42, 0.05);
}

.hero::before {
  content: '';

  position: absolute;

  width: 240px;
  height: 240px;

  top: -140px;
  right: 80px;

  border-radius: 50%;

  background:
    rgba(255, 255, 255, 0.06);

  pointer-events: none;
}

.hero::after {
  content: '';

  position: absolute;

  width: 180px;
  height: 180px;

  right: -45px;
  bottom: -95px;

  border-radius: 50%;

  background:
    rgba(255, 255, 255, 0.08);

  pointer-events: none;
}

.hero-top {
  position: relative;
  z-index: 2;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 2rem;
}

.brand {
  display: flex;
  align-items: center;

  min-width: 0;

  gap: 1.2rem;
}

.brand-icon {
  display: grid;

  width: 64px;
  height: 64px;

  flex: 0 0 auto;

  place-items: center;

  border: 1px solid
    rgba(255, 255, 255, 0.2);

  border-radius: 20px;

  background:
    rgba(255, 255, 255, 0.12);

  color: white;

  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.brand h1 {
  margin: 0 0 0.4rem;

  font-size:
    clamp(2rem, 5vw, 3.2rem);

  font-weight: 800;
  line-height: 1;

  letter-spacing: -0.05em;
}

.brand p {
  max-width: 560px;

  margin: 0;

  color:
    rgba(255, 255, 255, 0.82);

  font-size: 1.03rem;
  line-height: 1.55;
}

/* ACCIONES DEL HERO */

.hero-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  width: min(320px, 100%);

  gap: 0.55rem;
}

.language-switcher {
  display: flex;
  align-items: center;
  gap: 0.35rem;

  padding: 0.35rem 0.55rem;

  border: 1px solid
    rgba(255, 255, 255, 0.18);

  border-radius: 10px;

  background:
    rgba(255, 255, 255, 0.1);

  color:
    rgba(255, 255, 255, 0.65);

  backdrop-filter: blur(8px);
}

.language-switcher button {
  padding: 0;

  border: none;

  background: transparent;

  color:
    rgba(255, 255, 255, 0.55);

  cursor: pointer;

  font-size: 0.72rem;
  font-weight: 800;

  transition: color 0.15s ease;
}

.language-switcher button:hover,
.language-switcher button.active {
  color: white;
}

.language-switcher span {
  opacity: 0.4;
}

.active-group-banner {
  position: relative;
  z-index: 1;

  display: flex;
  align-items: center;

  gap: 0.4rem;

  margin-top: 1.5rem;
  padding-top: 1.15rem;

  border-top:
    1px solid
    rgba(255, 255, 255, 0.12);

  color:
    rgba(255, 255, 255, 0.65);

  font-size: 0.78rem;
}

.active-group-banner strong {
  color: white;

  font-weight: 750;
}

/* GRID */

.grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 1.5rem;
}

/* CARDS */

.card {
  padding: 1.5rem;

  border:
    1px solid #e7eceb;

  border-radius: 22px;

  background:
    rgba(255, 255, 255, 0.94);

  box-shadow:
    0 1px 2px
      rgba(15, 23, 42, 0.03),
    0 10px 30px
      rgba(15, 23, 42, 0.045);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);

  border-color: #d8e5e2;

  box-shadow:
    0 2px 4px
      rgba(15, 23, 42, 0.04),
    0 16px 35px
      rgba(15, 23, 42, 0.07);
}

.summary-card {
  grid-column: 1 / -1;
}

/* SECTION HEADINGS */

.section-heading {
  display: flex;
  align-items: center;

  gap: 0.85rem;

  margin-bottom: 1.35rem;
}

.section-icon {
  display: grid;

  width: 44px;
  height: 44px;

  flex: 0 0 auto;

  place-items: center;

  border-radius: 14px;

  background: #ecfdf5;
  color: #0f766e;

  box-shadow:
    inset 0 0 0 1px
      rgba(15, 118, 110, 0.05);
}

.eyebrow {
  display: block;

  margin-bottom: 0.08rem;

  color: #0f766e;

  font-size: 0.7rem;
  font-weight: 800;

  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.section-heading h2 {
  margin: 0;

  color: #172033;

  font-size: 1.25rem;
  font-weight: 750;
  line-height: 1.2;

  letter-spacing: -0.02em;
}

/* FOOTER */

.footer {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 0.45rem;

  margin-top: 2.2rem;

  color: #94a3b8;

  font-size: 0.82rem;
}

.footer span:first-child {
  color: #64748b;

  font-weight: 700;
}

.footer-separator {
  color: #cbd5e1;
}

/* RESPONSIVE */

@media (max-width: 850px) {
  .hero-top {
    flex-direction: column;
  }

  .hero-actions {
    align-items: stretch;

    width: 100%;
  }

  .language-switcher {
    align-self: flex-end;
  }
}

@media (max-width: 720px) {
  .home {
    width:
      min(
        100% - 1.25rem,
        1120px
      );

    padding-top: 1rem;
  }

  .hero {
    padding: 1.6rem;

    border-radius: 22px;
  }

  .brand {
    align-items: flex-start;
  }

  .brand-icon {
    width: 52px;
    height: 52px;

    border-radius: 16px;
  }

  .brand h1 {
    font-size: 2rem;
  }

  .brand p {
    font-size: 0.94rem;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .summary-card {
    grid-column: auto;
  }

  .card {
    padding: 1.2rem;

    border-radius: 18px;
  }

  .card:hover {
    transform: none;
  }

  .footer {
    flex-wrap: wrap;

    margin-top: 1.6rem;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 1.4rem;
  }

  .brand {
    gap: 0.9rem;
  }

  .brand-icon {
    width: 48px;
    height: 48px;
  }

  .brand h1 {
    font-size: 1.8rem;
  }

  .section-heading {
    margin-bottom: 1.1rem;
  }

  .active-group-banner {
    flex-wrap: wrap;
  }
}
</style>