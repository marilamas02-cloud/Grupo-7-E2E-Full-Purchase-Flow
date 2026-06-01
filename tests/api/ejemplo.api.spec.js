/**
 * ========================================================
 * EJEMPLO - Tests de API
 * ========================================================
 * Estos tests NO abren el navegador. Solo usan "request"
 * para hacer llamadas HTTP directas a la API de DemoBlaze.
 *
 * Borra estos ejemplos y escribi los tests de TU grupo.
 * ========================================================
 */

const { test, expect } = require('@playwright/test');
const { API, generarUsuario } = require('../helpers');

test('GET - Listar productos del catalogo', async ({ request }) => {
  const response = await request.get(`${API}/entries`);

  // Verificar que respondio bien
  expect(response.status()).toBe(200);

  // Verificar que hay productos
  const data = await response.json();
  expect(data.Items.length).toBeGreaterThan(0);

  // Verificar la estructura de un producto
  expect(data.Items[0]).toHaveProperty('title');
  expect(data.Items[0]).toHaveProperty('price');
});

test('POST - Registrar un usuario nuevo', async ({ request }) => {
  const usuario = generarUsuario();

  const response = await request.post(`${API}/signup`, {
    data: usuario,
  });

  expect(response.status()).toBe(200);
});

test('POST - Login devuelve un token', async ({ request }) => {
  // Primero creamos el usuario
  const usuario = generarUsuario();
  await request.post(`${API}/signup`, { data: usuario });

  // Ahora hacemos login
  const response = await request.post(`${API}/login`, {
    data: usuario,
  });

  expect(response.status()).toBe(200);

  // DemoBlaze devuelve texto, no JSON
  const texto = await response.text();
  console.log('Respuesta del login:', texto);
});
