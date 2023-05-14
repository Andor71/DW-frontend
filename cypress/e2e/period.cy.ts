import '../support/commands';
import { slowCypressDown } from 'cypress-slow-down';

slowCypressDown(150);

describe('Creating new period', () => {
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

  it('Deleting Period for Informatika', () => {
    const selectedCard = cy.get('#Informatika');
    if (selectedCard === null) {
      return;
    }
    selectedCard.find('.btn-outline-danger').click();
    cy.wait(500);
    const deleteButton = cy.get('button').contains('Yes, delete it!');
    deleteButton.click();
    cy.get('.toast-success').should('be.visible');
  });

  it('Create Period for Informatika', () => {
    const currentDate = new Date().toLocaleDateString();
    const ngPanle = cy.get('[aria-expanded="true"]');

    ngPanle
      .get('button')
      .contains('Új időszak létrehozása')
      .scrollIntoView()
      .click();
    cy.url().should('include', 'create-period');
    cy.get('[formcontrolName="major"]').select('Informatika');
    cy.get('[formcontrolName="startOfEnteringTopics"]').type(
      currentDate.toString()
    );

    cy.get('[formcontrolName="endOfEnteringTopics"]').type(
      currentDate.toString()
    );

    cy.get('[formcontrolName="firstTopicAdvertisement"]').type(
      currentDate.toString()
    );

    cy.get('[formcontrolName="firstTopicAdvertisementEnd"]').type(
      currentDate.toString()
    );

    cy.get('[formcontrolName="firstAllocation"]').type(
      currentDate.toString()
    );

    cy.get('[formcontrolName="secondTopicAdvertisement"]').type(
      currentDate.toString()
    );
    cy.get('[formcontrolName="secondTopicAdvertisementEnd"]').type(
      currentDate.toString()
    );
    cy.get('[formcontrolName="secondAllocation"]').type(
      currentDate.toString()
    );
    cy.get('[formcontrolName="implementationOfTopics"]').type(
      currentDate.toString()
    );
    cy.get('[formcontrolName="documentumUpload"]').type(
      currentDate.toString()
    );
    cy.get('[formcontrolName="diplomaDefend"]').type(
      currentDate.toString()
    );

    cy.get('button').contains('Időszak létrehozása').click();

    cy.wait(1500);

    cy.url().should('include', 'periods');

    cy.get('.toast-success').should('be.visible');
  });

  it('Update period Informatika', () => {
    let currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1);
    const selectedCard = cy.get('#Informatika');
    selectedCard.find('.btn-outline-warning').click();
    cy.url().should('include', 'period');
    const inputField = cy.get('[formcontrolName="diplomaDefend"]');
    inputField.clear();
    inputField.type(currentDate.toLocaleDateString());
    cy.get('button').contains('Időszak frissítése!').click();
    cy.url().should('include', 'periods');
    cy.get('.toast-success').should('be.visible');
  });
});
