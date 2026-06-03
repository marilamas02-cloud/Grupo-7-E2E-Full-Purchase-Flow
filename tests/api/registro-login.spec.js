const { test, expect } = require('@playwright/test');
const { generarCredenciales, crearUsuario, loginUsuario } = require('../helpers');

test.describe('GRUPO 7 — API Tests', () => {
  test('TC01 - Crear usuario via API', async ({ request }) => {
    const { username, password } = await generarCredenciales();
    const resultado = await crearUsuario(request, username, password);
    expect(resultado.status).toBe(200);
  });

  test('TC02 - Login via API con usuario creado', async ({ request }) => {
    // Setup: crea su propio usuario para no depender de TC01
    const { username, password } = await generarCredenciales();
    await crearUsuario(request, username, password);

    const resultado = await loginUsuario(request, username, password);
    expect(resultado.status).toBe(200);
    expect(resultado.authToken).toBeTruthy();
  });
});
