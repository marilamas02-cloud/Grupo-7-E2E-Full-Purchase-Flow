const { test, expect } = require('@playwright/test');

// Ejecutar tests de forma secuencial para garantizar que TC01 corra antes que TC02
test.describe.configure({ mode: 'serial' });

test.describe('GRUPO 7 — E2E Full Purchase Flow', () => {
  // Variables para credenciales aleatorias y auth token
  let username;
  let password;
  let authToken;

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

    console.log('✓ TC01 - Usuario registrado correctamente');
    console.log(`  Username: ${username}`);
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

    // Obtener la respuesta como texto
    const responseText = await response.text();

    // Extraer el auth token de la respuesta
    // La API retorna: "Auth_token: <token>"
    if (responseText && responseText.includes('Auth_token:')) {
      authToken = responseText.replace('Auth_token: ', '').trim();
      console.log('✓ TC02 - Login exitoso');
      console.log(`  Auth Token: ${authToken}`);
      expect(authToken).toBeTruthy();
    } else {
      throw new Error('No se obtuvo el Auth_token en la respuesta');
    }
  });
});
