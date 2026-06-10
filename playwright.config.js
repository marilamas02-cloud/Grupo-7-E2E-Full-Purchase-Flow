// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Configuracion de Playwright para el proyecto final.
 * Documentacion: https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',

  // Tiempo maximo que puede tardar un test antes de fallar
  timeout: 30 * 1000,

  // Corre los tests en paralelo
  fullyParallel: true,

  // Cantidad de reintentos si un test falla
  retries: 0,

  // Reporter: genera un reporte HTML lindo
  reporter: 'html',

  use: {
    // URL base: podes usar page.goto('/') en vez de la URL completa
    baseURL: 'https://www.demoblaze.com',

    // Guarda un trace cuando un test falla (util para debuggear)
    trace: 'on-first-retry',

    // Captura screenshot solo si el test falla
    screenshot: 'only-on-failure',
  },

  // Navegadores donde corren los tests
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
