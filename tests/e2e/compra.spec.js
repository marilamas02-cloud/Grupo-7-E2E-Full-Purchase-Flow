
const { test, expect } = require('@playwright/test');
const { generarCredenciales, crearUsuario, loginUsuario } = require('../helpers');

test.describe.configure({ mode: 'serial' });

test.describe('GRUPO 7 — E2E Full Purchase Flow', () => {
  // Variables para credenciales aleatorias
  let username;
  let password;
  let authToken;

  test.beforeAll(async () => {
    // Generar credenciales aleatorias para cada ejecución
    const credenciales = await generarCredenciales();
    username = credenciales.username;
    password = credenciales.password;
  });

  test('TC01 - Crear usuario via API', async ({ request }) => {
    const resultado = await crearUsuario(request, username, password);
    expect(resultado.status).toBe(200);
  });

  test('TC02 - Login via API', async ({ request }) => {
    const resultado = await loginUsuario(request, username, password);
    authToken = resultado.authToken;
    expect(resultado.status).toBe(200);
    expect(authToken).toBeTruthy();
  });

  test('TC03 - Navegar catálogo y seleccionar producto', async ({ page }) => {
    // Navegar a la página principal de DemoBlaze
    await page.goto('https://demoblaze.com/');

    // Esperar a que cargue la página
    await page.waitForLoadState('domcontentloaded');

    // Seleccionar el primer teléfono (Samsung galaxy s6)
    // Buscamos por texto 'Samsung galaxy s6' o por la clase .hrefch
    const productLink = page.locator('text=Samsung galaxy s6').first();
    await expect(productLink).toBeVisible();

    // Hacer clic en el producto
    await productLink.click();

    // Verificar que se cargó la página del producto
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('link', { name: 'Add to cart' })).toBeVisible();

    console.log('TC03: Producto seleccionado correctamente');
  });

  test('TC04 - Agregar producto al carrito (API + UI)', async ({ page }) => {
    // Inyectar cookies de sesión antes de navegar (más confiable que login por modal en headless)
    await page.context().addCookies([
      { name: 'tokenp', value: authToken, domain: 'demoblaze.com', path: '/' },
      { name: 'user',   value: username,  domain: 'demoblaze.com', path: '/' },
    ]);

    // Navegar a la página principal ya autenticado
    await page.goto('https://demoblaze.com/');
    await page.waitForLoadState('domcontentloaded');

    // Seleccionar el primer teléfono
    const productLink = page.locator('text=Samsung galaxy s6').first();
    await productLink.click();
    await page.waitForLoadState('domcontentloaded');

    // Configurar listener para aceptar automáticamente la alerta nativa
    page.on('dialog', async (dialog) => {
      console.log('Dialog message:', dialog.message());
      await dialog.accept();
    });

    // Configurar listener para la respuesta POST del carrito ANTES del click
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('https://api.demoblaze.com/addtocart') && response.request().method() === 'POST'
    );

    // Hacer clic en el botón "Add to cart"
    const addToCartButton = page.getByRole('link', { name: 'Add to cart' });
    await addToCartButton.click();

    // Esperar a que se complete la respuesta POST y verificar status 200
    // La API de DemoBlaze devuelve null en éxito, no un objeto JSON
    const response = await responsePromise;
    expect(response.status()).toBe(200);

    console.log('TC04: Producto agregado al carrito exitosamente');
  });

  test('TC05 - Validar carrito', async ({ page }) => {
    // Inyectar cookies de sesión antes de navegar
    await page.context().addCookies([
      { name: 'tokenp', value: authToken, domain: 'demoblaze.com', path: '/' },
      { name: 'user',   value: username,  domain: 'demoblaze.com', path: '/' },
    ]);

    // Navegar a la página principal ya autenticado
    await page.goto('https://demoblaze.com/');
    await page.waitForLoadState('domcontentloaded');

    // Seleccionar el producto
    const productLink = page.locator('text=Samsung galaxy s6').first();
    await productLink.click();
    await page.waitForLoadState('domcontentloaded');

    // Configurar listener para aceptar la alerta
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    // Agregar al carrito y esperar la respuesta de la API
    const addToCartButton = page.getByRole('link', { name: 'Add to cart' });
    const addCartResponse = page.waitForResponse(
      (response) => response.url().includes('addtocart') && response.request().method() === 'POST'
    );
    await addToCartButton.click();
    await addCartResponse;

    // Hacer clic en el botón "Cart" del menú superior
    // Esperar la respuesta del API de viewcart antes de buscar el producto
    const cartViewResponse = page.waitForResponse(
      (response) => response.url().includes('viewcart') && response.request().method() === 'POST'
    );
    const cartButton = page.locator('#cartur');
    await expect(cartButton).toBeVisible();
    await cartButton.click();
    await cartViewResponse;

    // Esperar a que cargue la página del carrito
    await page.waitForLoadState('domcontentloaded');

    // Validar que la tabla de productos contenga el producto
    const productRow = page.locator('#tbodyid tr').filter({ hasText: 'Samsung galaxy s6' }).first();
    await expect(productRow).toBeVisible({ timeout: 10000 });

    console.log('TC05: Producto validado en el carrito');

    // FIN PARTE 2 - CONTINÚA INTEGRANTE 3
  });
});
