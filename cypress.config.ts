import { defineConfig } from 'cypress';

module.exports = defineConfig({
  projectId: 'dw-frontend',
  viewportWidth: 1920,
  viewportHeight: 1200,
  watchForFileChanges: true,

  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: false,
    specPattern: ['cypress/e2e/**.cy.ts'],
    slowTestThreshold: 1000,
    scrollBehavior: false,
  },
  downloadsFolder: 'cypress/downloads',
  video: false,
  requestTimeout: 5000,
  responseTimeout: 30000,
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 30000,
  execTimeout: 30000,
  taskTimeout: 30000,
});
