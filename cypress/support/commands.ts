/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    addBun(bunName?: string): Chainable<void>;
    addIngredient(ingredientName: string): Chainable<void>;
    openIngredientModal(ingredientName: string): Chainable<JQuery<HTMLElement>>;
    createOrder(): Chainable<void>;
    checkEmptyConstructor(): Chainable<void>;
    checkOrderError(): Chainable<void>;
    addToConstructor(itemName: string): Chainable<void>;
    setupModalAliases(): Chainable<void>;
    getTotalPriceValue(): Chainable<number>;
    setupIngredientAliases(): Chainable<void>;
  }
}

Cypress.Commands.add('addToConstructor', (itemName: string) => {
  cy.contains(itemName)
    .parents('[data-cy="ingredient-card"]')
    .contains('button', 'Добавить')
    .click({ force: true });
});

Cypress.Commands.add('addBun', (bunName: string = 'Краторная булка N-200i') => {
  cy.addToConstructor(bunName);
});

Cypress.Commands.add('addIngredient', (ingredientName: string) => {
  cy.addToConstructor(ingredientName);
});

Cypress.Commands.add('setupModalAliases', () => {
  cy.get('[data-cy="modal"]').as('modal');
  cy.get('[data-cy="modal-content"]').as('modalContent');
  cy.get('[data-cy="modal-close-button"]').as('closeButton');
  cy.get('[data-cy="modal-overlay"]').as('overlay');
});

Cypress.Commands.add('setupIngredientAliases', () => {
  cy.get('[data-cy="constructor-bun-top"]').as('bunTop');
  cy.get('[data-cy="constructor-bun-bottom"]').as('bunBottom');
  cy.get('[data-cy="constructor-ingredients-list"]').as('ingredientsList');
});

Cypress.Commands.add('getTotalPriceValue', () =>
  cy
    .get('@totalPrice')
    .invoke('text')
    .then((price) => parseInt(price.replace(/\D/g, '')))
);

Cypress.Commands.add('openIngredientModal', (ingredientName: string) => {
  cy.contains(ingredientName).click();
  cy.setupModalAliases();
  cy.get('@modal').should('be.visible');
  return cy.get('@modal');
});

Cypress.Commands.add('createOrder', () => {
  cy.get('@orderButton').click();
  cy.wait('@createOrder');
  cy.setupModalAliases();
  cy.get('@modal').should('be.visible');
});

Cypress.Commands.add('checkEmptyConstructor', () => {
  cy.get('@emptyBun').should('be.visible');
  cy.get('@emptyIngredients').should('be.visible');
  cy.get('@totalPrice').should('contain', '0');
});

Cypress.Commands.add('checkOrderError', () => {
  cy.get('@bunTop').should('exist');
  cy.get('@bunBottom').should('exist');
  cy.get('@ingredientsList').should('exist');

  cy.getTotalPriceValue().then((numericPrice) =>
    expect(numericPrice).to.be.greaterThan(0)
  );

  cy.get('@orderButton').should('be.enabled');
  cy.get('[data-cy="modal"]').should('not.exist');
});
