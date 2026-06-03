const { test, expect } = require('@playwright/test');

test.describe('GRUPO 7 — Catálogo UI Tests', () => {
  test('TC03 - Navegar catálogo y seleccionar producto', async ({ page }) => {
    await page.goto('https://demoblaze.com/');
    await page.waitForLoadState('domcontentloaded');

    const productLink = page.locator('text=Samsung galaxy s6').first();
    await expect(productLink).toBeVisible();
    await productLink.click();

    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('link', { name: 'Add to cart' })).toBeVisible();

    console.log('TC03: Producto seleccionado correctamente');
  });
});
