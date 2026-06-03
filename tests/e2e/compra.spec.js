const { test, expect } = require('@playwright/test');
const { generarCredenciales, crearUsuario, loginUsuario } = require('../helpers');

test.describe('GRUPO 7 — E2E Full Purchase Flow', () => {
  async function crearSesion(request, page) {
    const { username, password } = await generarCredenciales();
    await crearUsuario(request, username, password);
    const { authToken } = await loginUsuario(request, username, password);

    await page.context().addCookies([
      { name: 'tokenp', value: authToken, domain: 'demoblaze.com', path: '/' },
      { name: 'user', value: username, domain: 'demoblaze.com', path: '/' },
    ]);

    return { username, authToken };
  }

  test('TC04 - Agregar producto al carrito', async ({ request, page }) => {
    await crearSesion(request, page);

    page.on('dialog', async (dialog) => {
      console.log('Dialog message:', dialog.message());
      await dialog.accept();
    });

    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('https://api.demoblaze.com/addtocart') &&
        response.request().method() === 'POST',
    );

    await page.goto('https://demoblaze.com/');
    await page.waitForLoadState('domcontentloaded');
    await page.locator('text=Samsung galaxy s6').first().click();
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('link', { name: 'Add to cart' }).click();

    const response = await responsePromise;
    expect(response.status()).toBe(200);

    console.log('TC04: Producto agregado al carrito exitosamente');
  });

  test('TC05 - Validar carrito con producto correcto', async ({ request, page }) => {
    await crearSesion(request, page);

    // Setup: agrega el producto para poder validarlo
    page.on('dialog', async (dialog) => await dialog.accept());

    const addToCartResponse = page.waitForResponse(
      (response) =>
        response.url().includes('addtocart') &&
        response.request().method() === 'POST',
    );

    await page.goto('https://demoblaze.com/');
    await page.waitForLoadState('domcontentloaded');
    await page.locator('text=Samsung galaxy s6').first().click();
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('link', { name: 'Add to cart' }).click();
    await addToCartResponse;

    // Validar que el producto está en el carrito
    const cartViewResponse = page.waitForResponse(
      (response) =>
        response.url().includes('viewcart') &&
        response.request().method() === 'POST',
    );
    await page.locator('#cartur').click();
    await cartViewResponse;
    await page.waitForLoadState('domcontentloaded');

    const productRow = page
      .locator('#tbodyid tr')
      .filter({ hasText: 'Samsung galaxy s6' })
      .first();
    await expect(productRow).toBeVisible({ timeout: 10000 });

    console.log('TC05: Producto validado en el carrito');
  });
});
