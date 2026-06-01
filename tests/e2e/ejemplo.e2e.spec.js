/**
 * ========================================================
 * EJEMPLO - Tests E2E Fullstack
 * ========================================================
 * Estos tests combinan API + UI en el mismo flujo.
 * Usan "request" para el setup rapido (crear usuario)
 * y "page" para probar la experiencia en el navegador.
 *
 * Patron de 3 fases:
 *   1. SETUP   -> crear datos por API (rapido)
 *   2. TEST    -> interactuar por UI (como el usuario)
 *   3. VERIFY  -> verificar el resultado
 *
 * Borra este ejemplo y escribi los tests de TU grupo.
 * ========================================================
 */

const { test, expect } = require('@playwright/test');
const { crearUsuarioPorAPI } = require('../helpers');

test('E2E - Usuario creado por API puede ver la tienda', async ({ request, page }) => {
  // === FASE 1: SETUP con API (rapido, sin navegador) ===
  const usuario = await crearUsuarioPorAPI(request);
  console.log('Usuario creado por API:', usuario.username);

  // === FASE 2: TEST con UI ===
  await page.goto('/');

  // === FASE 3: VERIFY ===
  await expect(page).toHaveTitle(/STORE/);

  const productos = page.locator('.card-title');
  await expect(productos.first()).toBeVisible();
});
