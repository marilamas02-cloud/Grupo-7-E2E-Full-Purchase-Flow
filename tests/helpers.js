/**
 * Helpers y constantes compartidas.
 * Importa esto en tus tests para no repetir codigo y usar los mismos valores.
 *
 * Ejemplo de uso:
 *   const { API, WEB, crearUsuarioPorAPI, loginUsuario } = require('./helpers');
 */

const { expect } = require('@playwright/test');

// URLs base
const API = 'https://api.demoblaze.com';
const WEB = 'https://www.demoblaze.com';

/**
 * Genera un usuario unico usando la fecha actual.
 * Asi nunca choca con "usuario ya existe".
 */
function generarUsuario() {
  return {
    username: `alumno_${Date.now()}`,
    password: 'bootcamp123',
  };
}

/**
 * Crea un usuario por API. Devuelve las credenciales usadas.
 * Util para el setup de tests E2E.
 */
async function crearUsuarioPorAPI(request) {
  const usuario = generarUsuario();
  await request.post(`${API}/signup`, { data: usuario });
  return usuario;
}

/**
 * Genera credenciales aleatorias para un nuevo usuario
 * @returns {Object} Objeto con username y password
 */
async function generarCredenciales() {
  const username = `user_${Date.now()}`;
  const password = 'Password123';
  return { username, password };
}

/**
 * Crea un nuevo usuario en DemoBlaze API
 * @param {Object} request - Playwright request object
 * @param {string} username - Username del usuario a crear
 * @param {string} password - Password del usuario
 */
async function crearUsuario(request, username, password) {
  const signupUrl = `${API}/signup`;

  const response = await request.post(signupUrl, {
    data: {
      username: username,
      password: password,
    },
  });

  expect(response.status()).toBe(200);

  console.log('✓ Usuario registrado correctamente');
  console.log(`  Username: ${username}`);

  return {
    username,
    password,
    status: response.status(),
  };
}

/**
 * Realiza login en DemoBlaze API y retorna el auth token
 * @param {Object} request - Playwright request object
 * @param {string} username - Username del usuario
 * @param {string} password - Password del usuario
 */
async function loginUsuario(request, username, password) {
  const loginUrl = `${API}/login`;

  const response = await request.post(loginUrl, {
    data: {
      username: username,
      password: password,
    },
  });

  expect(response.status()).toBe(200);

  // Obtener la respuesta como texto
  const responseText = await response.text();

  // Extraer el auth token de la respuesta
  // La API retorna: "Auth_token: <token>"
  let authToken = null;
  if (responseText && responseText.includes('Auth_token:')) {
    authToken = responseText.replace('Auth_token: ', '').trim();
    console.log('✓ Login exitoso');
    console.log(`  Auth Token: ${authToken}`);
    expect(authToken).toBeTruthy();
  } else {
    throw new Error('No se obtuvo el Auth_token en la respuesta');
  }

  return {
    username,
    password,
    authToken,
    status: response.status(),
  };
}

module.exports = { 
  API, 
  WEB, 
  generarUsuario,
  generarCredenciales,
  crearUsuarioPorAPI, 
  crearUsuario,
  loginUsuario,
};

