/* eslint-disable */

afterEach(function () {
  if (this.currentTest.state === 'failed') {
    Cypress.runner.stop()
  }
});

describe('Basic Modal', function () {

  const openModal = () => {
    cy.get('#trigger').click()
  }

  const closeModal = () => {
    cy.get('.modal__close').click()
  }

  it('should sucessfully load', () => {
    cy.visit('/basic.html')
  })

  it('should see toggle button', () => {
    cy.get('#trigger')
  })

  it('should not see the modal by default', () => {
    cy.get('#modal-1').and('not.be.visible')
    cy.get('#modal-1 .modal__overlay').and('not.be.visible')
  })

  /**
   * Checking overlay because the height of
   * .modal is zero and cypress treats that
   * as hidden
   */
  it('should open modal on target click', () => {
    openModal()
    cy.get('#modal-1 .modal__overlay').and('be.visible')
    closeModal()
  })

  it('should close modal on close button click', () => {
    openModal()
    cy.get('.modal__close').click()
    cy.get('.modal__close').and('not.be.visible')
    // modal closed here
  })

  it('should close modal on overlay click', () => {
    openModal()
    cy.get('.modal__overlay').click('top')
    cy.get('.modal__overlay').and('not.be.visible')
    // modal closed here
  })

  it('should not close modal when a press inside ends on the overlay', () => {
    openModal()
    cy.get('.modal__container').trigger('pointerdown')
    cy.get('.modal__overlay').trigger('click', 'top')
    cy.get('.modal__overlay').should('be.visible')
    closeModal()
  })


  it('should close modal on escape button press', () => {
    openModal()
    cy.get('body').type('{esc}')
    cy.get('#modal-1 .modal__overlay').and('not.be.visible')
    // modal closed here
  })


  it('should toggle aria-hidden class', () => {
    cy.get('#modal-1').should('have.attr', 'aria-hidden', 'true')
    openModal()
    cy.get('#modal-1').should('have.attr', 'aria-hidden', 'false')
    closeModal()
    cy.get('#modal-1').should('have.attr', 'aria-hidden', 'true')
  })



  it('should fire onShow method on modal open', () => {
    openModal()
    cy.get('body').should('have.class', 'howdy')
    closeModal()
  })


  it('should fire onClose method on modal close', () => {
    openModal()
    closeModal()
    cy.get('body').should('not.have.class', 'howdy')
  })


  it('should work with custom open class', () => {
    openModal()
    cy.get('#modal-1').should('have.class', 'open')
    closeModal()
    cy.get('#modal-1').should('not.have.class', 'open')
  })

})
