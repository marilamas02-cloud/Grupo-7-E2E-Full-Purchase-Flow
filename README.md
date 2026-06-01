# Playwright Bootcamp - Proyecto Final

Suite de tests automatizados sobre **DemoBlaze** usando Playwright.

> QA Automation Bootcamp - Rolling Code School - Tucuman

---

## Integrantes

> Completen con los nombres de su grupo:

- Nombre Apellido
- Nombre Apellido
- Nombre Apellido

**Grupo N - Seccion asignada:** (ej: Cart Management)

---

## Tecnologias

- [Playwright](https://playwright.dev/) - Framework de automatizacion
- Node.js - Runtime de JavaScript
- JavaScript - Lenguaje

---

## Instalacion

1. Cloná el repositorio:

```bash
git clone https://github.com/TU-USUARIO/TU-REPO.git
cd TU-REPO
```

2. Instalá las dependencias:

```bash
npm install
```

3. Instalá los navegadores de Playwright:

```bash
npx playwright install
```

---

## Como ejecutar los tests

```bash
# Correr TODOS los tests
npm test

# Correr solo los tests de API
npm run test:api

# Correr solo los tests de UI
npm run test:ui

# Correr solo los tests E2E
npm run test:e2e

# Correr mostrando el navegador (modo headed)
npm run test:headed

# Ver el reporte HTML del ultimo run
npm run report
```

---

## Estructura del proyecto

```
tests/
├── api/      → tests de API (usan request, no abren navegador)
├── ui/       → tests de UI (usan page, abren navegador)
├── e2e/      → tests E2E Fullstack (combinan API + UI)
└── helpers.js → constantes y funciones compartidas
```

### Regla para no pisarse

- Los archivos **`.api.spec.js`** solo usan `request`.
- Los archivos **`.ui.spec.js`** solo usan `page`.
- Los archivos **`.e2e.spec.js`** usan `request + page`.

Cada test crea sus propios datos con `Date.now()`, así son independientes
y no dependen del estado que dejó otro test.

---

## Notas tecnicas sobre DemoBlaze

- El **login por UI puede bloquearse** con Playwright. Si necesitan un
  usuario logueado, créenlo y logueen **por API** (ver `helpers.js`).
- La API solo permite **vaciar el carrito completo** (`/deletecart`),
  no eliminar un producto individual. Para eso, usen la UI.
- `/login` devuelve **texto** (no JSON): usar `response.text()`.
- `/signup` devuelve **string vacío** cuando sale bien.

---

## Convenciones de commits

```bash
git commit -m "TC01: Signup exitoso implementado"
git commit -m "TC02: Validacion usuario duplicado"
git commit -m "Fix: corregir locator del modal de login"
```
