# SaldoCero

Aplicación web para gestionar y dividir gastos compartidos de forma sencilla.

SaldoCero permite crear grupos independientes, registrar personas y gastos, calcular automáticamente quién debe dinero a quién y registrar pagos hasta saldar las cuentas.

La aplicación está disponible en **español e inglés**.

## Demo

Puedes probar la aplicación aquí:

**[Abrir SaldoCero](https://saldocero.vercel.app/)**

## Características

- Creación de múltiples grupos independientes.
- Gestión de personas dentro de cada grupo.
- Registro y eliminación de gastos.
- Posibilidad de seleccionar uno o varios pagadores.
- Reparto automático de gastos entre los participantes.
- Cálculo automático del balance de cada persona.
- Cálculo de quién debe pagar a quién.
- Registro de pagos parciales.
- Posibilidad de marcar una deuda como pagada.
- Historial de pagos registrados.
- Persistencia de datos en el navegador.
- Interfaz disponible en español e inglés.
- Diseño responsive para escritorio y dispositivos móviles.

## Tecnologías utilizadas

- **Vue 3**
- **JavaScript**
- **Pinia**
- **Vue Router**
- **Vite**
- **Pinia Plugin Persisted State**
- **Lucide Icons**
- **CSS**

## ¿Cómo funciona?

Cada grupo de SaldoCero mantiene de forma independiente sus:

- Personas
- Gastos
- Pagos
- Balances

Cuando se registra un gasto, SaldoCero calcula cuánto corresponde pagar a cada miembro del grupo y compara esa cantidad con lo que realmente ha pagado.

A partir de esos datos se obtiene el balance de cada persona y se calculan automáticamente los pagos necesarios para dejar todas las cuentas a cero.

También es posible registrar pagos parciales entre los participantes, actualizando los balances pendientes.

## Persistencia de datos

SaldoCero utiliza almacenamiento local en el navegador para conservar los datos.

Esto permite mantener grupos, personas, gastos y pagos incluso después de cerrar o recargar la aplicación.

> Los datos se almacenan en el dispositivo y navegador actual. No existe sincronización entre dispositivos ni cuentas de usuario.

## Idiomas

La aplicación está disponible en:

- Español
- English

El usuario puede seleccionar el idioma de la interfaz.

## Instalación local

Clona el repositorio:

```bash
git clone https://github.com/samuelmeleroWEB/saldo-cero
```

Entra en el proyecto:

```bash
cd saldo-cero
```

Instala las dependencias:

```bash
npm install
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

## Build de producción

Para generar una versión de producción:

```bash
npm run build
```

Para probarla localmente:

```bash
npm run preview
```

## Estructura principal

```text
src/
├── assets/
├── components/
│   ├── BalanceSummary.vue
│   ├── ExpenseForm.vue
│   ├── ExpenseList.vue
│   ├── GroupSelector.vue
│   ├── PersonForm.vue
│   └── PersonList.vue
├── i18n/
│   ├── en.js
│   ├── es.js
│   └── index.js
├── router/
├── stores/
│   └── expenses.js
├── views/
│   └── HomeView.vue
├── App.vue
└── main.js
```

## Motivación

SaldoCero nació como un proyecto personal para poner en práctica mis conocimientos de **Vue 3** construyendo una aplicación funcional de principio a fin.

El objetivo era desarrollar en un solo día una aplicación sencilla pero completa, trabajando aspectos como:

- Arquitectura basada en componentes.
- Gestión global del estado con Pinia.
- Propiedades computadas.
- Persistencia de datos.
- Internacionalización.
- Lógica de cálculo de balances.
- Diseño responsive.
- Build y despliegue de una aplicación Vue.

## Estado del proyecto

El proyecto es funcional y está desplegado públicamente.

Algunas posibles mejoras futuras:

- Base de datos y sincronización entre dispositivos.
- Sistema de usuarios.
- Compartir grupos mediante enlaces.
- Diferentes monedas.
- Edición de gastos.
- Estadísticas y gráficos de gastos.

## Autor

Proyecto desarrollado como práctica y proyecto personal de desarrollo frontend.

---

Built with Vue 3.
