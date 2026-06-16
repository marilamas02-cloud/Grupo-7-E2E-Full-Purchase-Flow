const { test, expect } = require('@playwright/test');
const { generarCredenciales, crearUsuario, loginUsuario } = require('../helpers');

test('Flujo completo de compra E2E', async ({ request, page }) => {
  let username;
  let password;
  let authToken;

  await test.step('TC01 - Crear usuario via API', async () => {
    const credenciales = await generarCredenciales();
    username = credenciales.username;
    password = credenciales.password;

    const resultado = await crearUsuario(request, username, password);
    expect(resultado.status).toBe(200);
  });

  await test.step('TC02 - Login via API', async () => {
    const resultado = await loginUsuario(request, username, password);
    authToken = resultado.authToken;
    expect(resultado.status).toBe(200);
    expect(authToken).toBeTruthy();
  });

  await test.step('TC03 - Navegar catálogo y seleccionar producto', async () => {
    await page.goto('https://demoblaze.com/');
    await page.waitForLoadState('domcontentloaded');

    const productLink = page.locator('text=Samsung galaxy s6').first();
    await expect(productLink).toBeVisible();
    await productLink.click();

    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('link', { name: 'Add to cart' })).toBeVisible();
  });

  await test.step('TC04 - Agregar producto al carrito', async () => {
    await page.context().addCookies([
      { name: 'tokenp', value: authToken, domain: 'demoblaze.com', path: '/' },
      { name: 'user', value: username, domain: 'demoblaze.com', path: '/' },
    ]);

    page.on('dialog', async (dialog) => await dialog.accept());

    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('https://api.demoblaze.com/addtocart') &&
        response.request().method() === 'POST',
    );

    await page.getByRole('link', { name: 'Add to cart' }).click();

    const response = await responsePromise;
    expect(response.status()).toBe(200);
  });

  await test.step('TC05 - Validar carrito con producto correcto', async () => {
    const cartViewResponse = page.waitForResponse(
      (response) =>
        response.url().includes('viewcart') &&
        response.request().method() === 'POST',
    );

    const cartButton = page.locator('#cartur');
    await expect(cartButton).toBeVisible();
    await cartButton.click();
    await cartViewResponse;

    await page.waitForLoadState('domcontentloaded');

    const productRow = page
      .locator('#tbodyid tr')
      .filter({ hasText: 'Samsung galaxy s6' })
      .first();
    await expect(productRow).toBeVisible({ timeout: 10000 });
  });

  await test.step('TC06 - Completar formulario de checkout', async () => {
    const placeOrderButton = page.locator('button:has-text("Place Order")');
    await expect(placeOrderButton).toBeVisible({ timeout: 15000 });
    await expect(placeOrderButton).toBeEnabled();
    await placeOrderButton.click();

    await page.waitForSelector('#orderModal.show', { timeout: 15000 });
    await expect(page.locator('#orderModal')).toBeVisible();

    await page.fill('#name', 'Marisol Lamas');
    await page.fill('#country', 'Argentina');
    await page.fill('#city', 'Tucumán');
    await page.fill('#card', '4555111122223333');
    await page.fill('#month', '12');
    await page.fill('#year', '2026');

    await page.locator('button:has-text("Purchase")').click();

    await page.waitForSelector('.sweet-alert h2', { timeout: 15000 });
  });

  await test.step('TC07 - Validar confirmación de compra', async () => {
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
  });
});
