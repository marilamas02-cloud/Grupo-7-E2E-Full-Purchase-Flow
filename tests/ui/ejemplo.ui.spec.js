/**
 * ========================================================
 * EJEMPLO - Tests de UI
 * ========================================================
 * Estos tests SI abren el navegador. Usan "page" para
 * interactuar con la interfaz como un usuario real.
 *
 * Borra estos ejemplos y escribi los tests de TU grupo.
 * ========================================================
 */

const { test, expect } = require('@playwright/test');

test('La pagina principal carga correctamente', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.card-title', { timeout: 15000 });

  // Verificar el titulo de la pagina
  await expect(page).toHaveTitle(/STORE/);

  // Verificar que se ven productos
  const productos = page.locator('.card-title');
  await expect(productos.first()).toBeVisible();
});

test('Navegar a la categoria Phones', async ({ page }) => {
  await page.goto('/');

  // Click en la categoria Phones
  await page.getByRole('link', { name: 'Phones' }).click();

  // Esperar a que carguen los productos de la categoria
  await page.waitForSelector('.card-title', { timeout: 15000 });

  // Verificar que hay productos visibles
  const productos = page.locator('.card-title');
  await expect(productos.first()).toBeVisible();
});

test('Abrir el detalle de un producto', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.card-title', { timeout: 15000 });

  // Click en el primer producto
  await page.locator('.card-title a').first().click();

  // Verificar que se ve el boton de agregar al carrito
  await expect(page.getByRole('link', { name: 'Add to cart' })).toBeVisible();
});
