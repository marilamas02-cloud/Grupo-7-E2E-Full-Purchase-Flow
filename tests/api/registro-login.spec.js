const { test, expect } = require('@playwright/test');
const {
  generarCredenciales,
  crearUsuario,
  loginUsuario,
} = require('../helpers');

// Ejecutar tests de forma secuencial para garantizar que TC01 corra antes que TC02
test.describe.configure({ mode: 'serial' });

test.describe('GRUPO 7 — E2E Full Purchase Flow (API)', () => {
  // Variables para credenciales aleatorias y auth token
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
});
