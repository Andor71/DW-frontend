import '../support/commands';
import { slowCypressDown } from 'cypress-slow-down';
slowCypressDown(100);

describe('Uploading file for periods', () => {
  beforeEach('Login', () => {
    cy.login('a@a.com', '123').then(() => {
      cy.wait(1000);
      cy.url().should('include', 'periods');
    });
  });

  afterEach('Logout', () => {
    cy.logout().then(() => {
      cy.wait(1000);
      cy.url().should('include', 'login');
    });
  });

  it('Upload should fail if no document selected', () => {
    const ngPanle = cy.get('[aria-expanded="true"]');
    const uploadeButton = ngPanle
      .get('button[type=submit]')
      .contains('Feltöltés');
    uploadeButton.click();
    cy.get('.toast-warning').should('be.visible');
  });

  it('Upload PDF', () => {
    const ngPanle = cy.get('[aria-expanded="true"]');
    const fileUploadeInput = ngPanle.get('[name="pdfFiles"]');

    fileUploadeInput.attachFile('undefined.pdf');

    const uploadeButton = ngPanle
      .get('button[type=submit]')
      .contains('Feltöltés');

    uploadeButton.click();

    cy.get('.toast-success')
      .should('be.visible')
      .then(() => {
        const list = cy.get('#document-list');
        list.should('contain.text', 'undefined.pdf');
      });
  });

  it('Delete PDF', () => {
    const pdfCard = cy.get('[id="undefined.pdf"]');
    const deleteButtonCard = pdfCard.get('.ri-delete-bin-2-line');
    deleteButtonCard.click();
    const deleteButton = cy.get('button').contains('Yes, delete it!');
    deleteButton.click();
    cy.get('.toast-success').should('be.visible');
    cy.get('[id="undefined.pdf"]').should('not.exist');
  });
});
