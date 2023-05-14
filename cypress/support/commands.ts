// / <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
import 'cypress-file-upload';
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('http://localhost:4200/#/login');
  cy.url().should('include', 'login');

  let emailInput = cy.get('input[name=email]');

  emailInput.clear();
  emailInput.type(email);

  let passwordInput = cy.get('input[name=password]');

  passwordInput.clear();
  passwordInput.type(password);

  cy.get('button[type=submit]').click();
});

Cypress.Commands.add('logout', () => {
  const dropDown = cy.get('#page-header-user-dropdown');
  dropDown.trigger('click');
  cy.wait(1000);
  dropDown
    .get('.dropdown-item')
    .contains('Logout')
    .click({ force: true });
});
