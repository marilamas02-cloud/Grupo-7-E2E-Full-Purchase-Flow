const { test, expect } = require('@playwright/test');
const { generarCredenciales, crearUsuario, loginUsuario } = require('../helpers');

test.describe('GRUPO 7 — Checkout UI Tests', () => {
  async function setupConProductoEnCarrito(request, page) {
    const { username, password } = await generarCredenciales();
    await crearUsuario(request, username, password);
    const { authToken } = await loginUsuario(request, username, password);

    await page.context().addCookies([
      { name: 'tokenp', value: authToken, domain: 'demoblaze.com', path: '/' },
      { name: 'user', value: username, domain: 'demoblaze.com', path: '/' },
    ]);

    await page.goto('https://demoblaze.com/');
    await page.waitForLoadState('domcontentloaded');

    page.on('dialog', async (dialog) => await dialog.accept());

    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('addtocart') &&
        response.request().method() === 'POST',
    );

    await page.locator('text=Samsung galaxy s6').first().click();
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('link', { name: 'Add to cart' }).click();
    await responsePromise;
  }

  async function completarFormulario(page) {
    await page.fill('#name', 'Marisol Lamas');
    await page.fill('#country', 'Argentina');
    await page.fill('#city', 'Tucumán');
    await page.fill('#card', '4555111122223333');
    await page.fill('#month', '12');
    await page.fill('#year', '2026');
    await page.locator('button:has-text("Purchase")').click();
  }

  test('TC06 - Completar formulario de checkout', async ({ request, page }) => {
    await setupConProductoEnCarrito(request, page);

    await page.goto('https://demoblaze.com/cart.html');
    await page.waitForSelector('#tbodyid tr', { timeout: 15000 });

    const placeOrderButton = page.locator('button:has-text("Place Order")');
    await expect(placeOrderButton).toBeVisible({ timeout: 15000 });
    await expect(placeOrderButton).toBeEnabled();
    await placeOrderButton.click();

    await page.waitForSelector('#orderModal.show', { timeout: 15000 });
    await expect(page.locator('#orderModal')).toBeVisible();

    await completarFormulario(page);

    console.log('TC06: Formulario de checkout completado y enviado');
  });

  test('TC07 - Validar confirmación de compra', async ({ request, page }) => {
    await setupConProductoEnCarrito(request, page);

    await page.goto('https://demoblaze.com/cart.html');
    await page.waitForSelector('#tbodyid tr', { timeout: 15000 });

    const placeOrderButton = page.locator('button:has-text("Place Order")');
    await expect(placeOrderButton).toBeVisible({ timeout: 15000 });
    await expect(placeOrderButton).toBeEnabled();
    await placeOrderButton.click();

    await page.waitForSelector('#orderModal.show', { timeout: 15000 });

    await completarFormulario(page);

    const successTitle = page.locator('.sweet-alert h2');
    await expect(successTitle).toBeVisible({ timeout: 15000 });
    await expect(successTitle).toContainText(/Gracias por su compra!|Thank you for your purchase!/);

    const modalContent = page.locator('.sweet-alert p.lead.text-muted');
    await expect(modalContent).toBeVisible();
    const contentText = await modalContent.textContent();
    expect(contentText).toContain('Card Number: 4555111122223333');
    expect(contentText).toContain('Name: Marisol Lamas');

    const okButton = page.locator('.sweet-alert button.confirm');
    await expect(okButton).toBeVisible();
    await okButton.click();

    console.log('TC07: Confirmación de compra validada');
  });
});
