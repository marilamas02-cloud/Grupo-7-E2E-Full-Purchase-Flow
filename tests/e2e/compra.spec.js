const { test, expect } = require('@playwright/test');

test.describe('GRUPO 7 — E2E Full Purchase Flow', () => {
  // Variables para credenciales aleatorias
  let username;
  let password;

  test.beforeAll(() => {
    // Generar credenciales aleatorias para cada ejecución
    username = 'user_' + Date.now();
    password = 'Password123';
  });

  test('TC01 - Crear usuario via API', async ({ request }) => {
    // Endpoint de registro en DemoBlaze
    const signupUrl = 'https://api.demoblaze.com/signup';

    // Realizar request POST para crear usuario
    const response = await request.post(signupUrl, {
      data: {
        username: username,
        password: password,
      },
    });

    // Verificar que la respuesta sea exitosa (status 200)
    expect(response.status()).toBe(200);

    // Parsear y verificar la respuesta
    const responseBody = await response.json();
    console.log('Response TC01:', responseBody);

    // Verificar que la respuesta sea exitosa
    expect(responseBody).toHaveProperty('isSuccessful');
    expect(responseBody.isSuccessful).toBe(true);
  });

  test('TC02 - Login via API', async ({ request }) => {
    // Endpoint de login en DemoBlaze
    const loginUrl = 'https://api.demoblaze.com/login';

    // Realizar request POST para login
    const response = await request.post(loginUrl, {
      data: {
        username: username,
        password: password,
      },
    });

    // Verificar que la respuesta sea exitosa (status 200)
    expect(response.status()).toBe(200);

    // Parsear y verificar la respuesta
    const responseBody = await response.json();
    console.log('Response TC02:', responseBody);

    // Verificar que la respuesta sea exitosa
    expect(responseBody).toHaveProperty('isSuccessful');
    expect(responseBody.isSuccessful).toBe(true);

    // Extraer y guardar el auth token si está disponible
    if (responseBody.authToken) {
      console.log('Auth Token:', responseBody.authToken);
    }
  });
});
