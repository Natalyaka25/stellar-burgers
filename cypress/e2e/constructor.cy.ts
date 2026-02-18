describe('Конструктор бургера', () => {
  const BASE_URL = 'http://localhost:4000/';
  const BUN_NAME = 'Краторная булка N-200i';
  const SAUCE_NAME = 'Соус Spicy-X';
  const MEAT_NAME = 'Мясо бессмертных моллюсков Protostomia';
  const EXPECTED_PRICE = '3937';
  const ORDER_NUMBER = '12345';
  const LOADING_MESSAGE = 'Оформляем заказ...';

  beforeEach(() => {
    window.localStorage.setItem('accessToken', 'test-access-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.intercept('GET', 'api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: {
          email: 'test@example.com',
          name: 'Test User'
        }
      }
    }).as('getUser');

    cy.fixture('ingredients.json').then((ingredients) => {
      cy.intercept('GET', 'api/ingredients', {
        statusCode: 200,
        body: ingredients
      }).as('getIngredients');
    });

    cy.intercept('POST', 'api/orders', {
      statusCode: 200,
      body: {
        success: true,
        order: {
          number: ORDER_NUMBER
        }
      }
    }).as('createOrder');

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.url().should('eq', BASE_URL);

    cy.get('[data-cy="order-button"]').as('orderButton');
    cy.get('[data-cy="constructor-price"]').as('totalPrice');
    cy.get('[data-cy="constructor-empty-bun"]').as('emptyBun');
    cy.get('[data-cy="constructor-empty-ingredients"]').as('emptyIngredients');

    cy.contains(BUN_NAME).parents('[data-cy="ingredient-card"]').as('bunCard');
    cy.contains(SAUCE_NAME)
      .parents('[data-cy="ingredient-card"]')
      .as('sauceCard');
    cy.contains(BUN_NAME).as('bunIngredient');
  });

  afterEach(() => {
    window.localStorage.clear();
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Добавление ингредиентов', () => {
    it('должен добавлять булку в конструктор', () => {
      cy.addBun();
      cy.setupIngredientAliases();

      cy.get('@bunTop').should('contain', BUN_NAME);
      cy.get('@bunBottom').should('contain', BUN_NAME);
    });

    it('должен добавлять несколько ингредиентов', () => {
      cy.addBun();
      cy.setupIngredientAliases();

      cy.get('@bunTop').should('exist');
      cy.get('@bunBottom').should('exist');

      cy.addIngredient(SAUCE_NAME);
      cy.get('@ingredientsList').should('contain', SAUCE_NAME);

      cy.addIngredient(MEAT_NAME);
      cy.get('@ingredientsList').should('contain', MEAT_NAME);

      cy.get('@totalPrice').should('contain', EXPECTED_PRICE);
    });
  });

  describe('Модальные окна ингредиентов', () => {
    describe('Открытие модального окна', () => {
      it('должен открывать модальное окно при клике на ингредиент', () => {
        cy.openIngredientModal(BUN_NAME);
        cy.get('@modalContent').should('contain', BUN_NAME);
      });

      it('должен открывать модальное окно для другого ингредиента', () => {
        cy.openIngredientModal(SAUCE_NAME);
        cy.get('@modalContent').should('contain', SAUCE_NAME);
      });
    });

    describe('Закрытие модального окна', () => {
      beforeEach(() => {
        cy.openIngredientModal(BUN_NAME);
      });

      it('должен закрывать по клику на крестик', () => {
        cy.get('@closeButton').click();
        cy.get('@modal').should('not.exist');
      });

      it('должен закрывать по клику на оверлей', () => {
        cy.get('@overlay').click({ force: true });
        cy.get('@modal').should('not.exist');
      });

      it('должен закрывать по нажатию ESC', () => {
        cy.get('body').type('{esc}');
        cy.get('@modal').should('not.exist');
      });
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.addBun();
      cy.addIngredient(SAUCE_NAME);
      cy.setupIngredientAliases();
    });

    it('должен создавать заказ и показывать номер', () => {
      cy.createOrder();
      cy.get('@modal').should('be.visible');
      cy.get('@modalContent').should('contain', ORDER_NUMBER);
    });

    it('должен очищать конструктор после заказа', () => {
      cy.createOrder();
      cy.get('@closeButton').click();
      cy.get('@modal').should('not.exist');

      cy.checkEmptyConstructor();
    });

    it('должен показывать и скрывать прелоадер во время создания заказа', () => {
      cy.intercept('POST', 'api/orders', (req) => {
        req.reply({
          delay: 1000,
          statusCode: 200,
          body: {
            success: true,
            order: { number: ORDER_NUMBER }
          }
        });
      }).as('delayedOrder');

      cy.get('@orderButton').click();
      cy.contains(LOADING_MESSAGE, { timeout: 1000 }).should('be.visible');
      cy.wait('@delayedOrder');
      cy.contains(LOADING_MESSAGE).should('not.exist');
      cy.setupModalAliases();
      cy.get('@modal').should('be.visible');
      cy.get('@modalContent').should('contain', ORDER_NUMBER);
    });

    it('должен обрабатывать ошибку при создании заказа', () => {
      cy.intercept('POST', 'api/orders', {
        statusCode: 500,
        body: {
          success: false,
          message: 'Internal Server Error'
        }
      }).as('createOrderError');

      cy.get('@orderButton').click();
      cy.wait('@createOrderError');

      cy.checkOrderError();
    });
  });
});
