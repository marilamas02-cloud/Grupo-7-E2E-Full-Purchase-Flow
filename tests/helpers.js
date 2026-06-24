const { expect } = require('@playwright/test');

const API = 'https://api.demoblaze.com';
const WEB = 'https://www.demoblaze.com';

async function generarCredenciales() {
  return {
    username: `user_${Date.now()}`,
    password: 'Password123',
  };
}

async function crearUsuarioPorAPI(request) {
  const credenciales = await generarCredenciales();
  await request.post(`${API}/signup`, { data: credenciales });
  return credenciales;
}

async function crearUsuario(request, username, password) {
  const response = await request.post(`${API}/signup`, {
    data: { username, password },
  });

  expect(response.status()).toBe(200);
  console.log(`✓ Usuario registrado: ${username}`);

  return { username, password, status: response.status() };
}

async function loginUsuario(request, username, password) {
  const response = await request.post(`${API}/login`, {
    data: { username, password },
  });

  expect(response.status()).toBe(200);

  const responseText = await response.text();

  if (!responseText.includes('Auth_token:')) {
    throw new Error('No se obtuvo el Auth_token en la respuesta');
  }

  const authToken = responseText
    .replace('Auth_token: ', '')
    .trim()
    .replace(/"/g, '');

  expect(authToken).toBeTruthy();
  console.log(`✓ Login exitoso. Token: ${authToken}`);

  return { username, password, authToken, status: response.status() };
}

module.exports = {
  API,
  WEB,
  generarCredenciales,
  crearUsuarioPorAPI,
  crearUsuario,
  loginUsuario,
};
