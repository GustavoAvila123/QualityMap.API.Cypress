const { defineConfig } = require("cypress");
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

module.exports = defineConfig({
  viewportWidth: 1366,
  viewportHeight: 768, 

  "chromeWebSecurity": false,  
  env: {
    API_BASE_URL_USUARIOS: 'https://serverest.dev/usuarios/',
    API_BASE_URL_PRODUTOS: 'https://serverest.dev/produtos/',
    API_BASE_URL_LOGIN: 'https://serverest.dev/login',
    API_BASE_URL_CARRINHOS: 'https://serverest.dev/carrinhos/',
    API_BASE_URL_CARRINHOS_CONCLUIRCOMPRA: 'https://serverest.dev/carrinhos/concluir-compra',
    API_BASE_URL_CARRINHOS_CANCELARCOMPRA: 'https://serverest.dev/carrinhos/cancelar-compra',
    allure: true,
    video: false,
  },
  e2e: {
    API_BASE_URL_USUARIOS: 'https://serverest.dev/usuarios/',
    API_BASE_URL_PRODUTOS: 'https://serverest.dev/produtos/',
    API_BASE_URL_LOGIN: 'https://serverest.dev/login',
    API_BASE_URL_CARRINHOS: 'https://serverest.dev/carrinhos/',
    API_BASE_URL_CARRINHOS_CONCLUIRCOMPRA: 'https://serverest.dev/carrinhos/concluir-compra',
    API_BASE_URL_CARRINHOS_CANCELARCOMPRA: 'https://serverest.dev/carrinhos/cancelar-compra',
    setupNodeEvents(on, config) {
        allureWriter(on, config);
        return config;
    },
  },
  reporter: 'junit',
  reporterOptions: {
    reportDir: 'allure-results',
    mochaFile: 'allure-results/junit-report-[hash].xml',
    toConsole: true,
  }
});