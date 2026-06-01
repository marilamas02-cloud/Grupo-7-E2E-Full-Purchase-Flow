const { test, expect } = require('@playwright/test');

test.describe('GRUPO 7 — Checkout UI Tests', () => {
  test('TC06 - Completar formulario de checkout', async ({ page }) => {
    // Navegar a la página del carrito (asume que ya hay un producto agregado)
    await page.goto('/cart.html');
    await page.waitForSelector('#tbodyid tr', { timeout: 15000 });
    await page.waitForSelector('button:has-text("Place Order")', { timeout: 15000 });

    // Validar que hay al menos un producto en el carrito
    const productRows = page.locator('#tbodyid tr');
    const rowCount = await productRows.count();
    expect(rowCount).toBeGreaterThan(0);

    // Localizar y hacer clic en el botón "Place Order"
    const placeOrderButton = page.locator('button:has-text("Place Order")');
    await expect(placeOrderButton).toBeVisible({ timeout: 15000 });
    await expect(placeOrderButton).toBeEnabled();
    await placeOrderButton.click();

    // Esperar a que se abra el modal de checkout
    await page.waitForSelector('#orderModal.show', { timeout: 15000 });
    await expect(page.locator('#orderModal')).toBeVisible();

    // Completar los campos obligatorios del modal usando page.fill()
    await page.fill('#name', 'Marisol Lamas');
    await page.fill('#country', 'Argentina');
    await page.fill('#city', 'Tucumán');
    await page.fill('#card', '4555111122223333');
    await page.fill('#month', '12');
    await page.fill('#year', '2026');

    // Hacer clic en el botón "Purchase"
    const purchaseButton = page.locator('button:has-text("Purchase")');
    await expect(purchaseButton).toBeVisible();
    await purchaseButton.click();

    console.log('TC06: Formulario de checkout completado y enviado');
  });

  test('TC07 - Validar mensaje de confirmación final', async ({ page }) => {
    // Completar el flujo de compra de nuevo, porque cada test usa un contexto limpio
    await page.goto('/cart.html');
    await page.waitForSelector('#tbodyid tr', { timeout: 15000 });
    await page.waitForSelector('button:has-text("Place Order")', { timeout: 15000 });
    const placeOrderButton = page.locator('button:has-text("Place Order")');
    await expect(placeOrderButton).toBeVisible({ timeout: 15000 });
    await expect(placeOrderButton).toBeEnabled();
    await placeOrderButton.click();
    await page.waitForSelector('#orderModal.show', { timeout: 15000 });
    await page.fill('#name', 'Marisol Lamas');
    await page.fill('#country', 'Argentina');
    await page.fill('#city', 'Tucumán');
    await page.fill('#card', '4555111122223333');
    await page.fill('#month', '12');
    await page.fill('#year', '2026');
    await page.locator('button:has-text("Purchase")').click();

    // Esperar a que aparezca la confirmación
    const successTitle = page.locator('.sweet-alert h2');
    await expect(successTitle).toBeVisible({ timeout: 15000 });
    await expect(successTitle).toContainText(/Gracias por su compra!|Thank you for your purchase!/);

    // Validar que los detalles internos del modal muestren información del pago
    const modalContent = page.locator('.sweet-alert p.lead.text-muted');
    await expect(modalContent).toBeVisible();
    const contentText = await modalContent.textContent();
    expect(contentText).toContain('Card Number: 4555111122223333');
    expect(contentText).toContain('Name: Marisol Lamas');

    // Cerrar la confirmación
    const okButton = page.locator('.sweet-alert button.confirm');
    await expect(okButton).toBeVisible();
    await okButton.click();

    console.log('TC07: Validación de confirmación completada');
  });
});
