/* eslint-disable */

describe('Programmatic toggling of Modal', function () {

  const openModal = () => {
    cy.get('#open-trigger').click()
  }

  const openModalViaElementReference = () => {
    cy.get('#open-trigger-2').click()
  }

  const closeModal = () => {
    cy.get('#close-trigger').click()
  }

  const closeModalViaElementReference = () => {
    cy.get('#close-trigger-2').click()
  }

  it('should sucessfully load', () => {
    cy.visit('/programmatic.html')
  })

  it('should see toggle button', () => {
    cy.get('#open-trigger')
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
  it('should open modal programmaticaly', () => {
    openModal()
    cy.get('#modal-1 .modal__overlay').and('be.visible')
    closeModal()
  })

  it('should open modal programmaticaly', () => {
    openModal()
    closeModal()
    cy.get('#modal-1 .modal__overlay').and('not.be.visible')
  })

  it('should close modal on close button click', () => {
    openModal()
    cy.get('.modal__close').click()
    cy.get('.modal__close').and('not.be.visible')
  })

  it('should close modal on overlay click', () => {
    openModal()
    cy.get('.modal__overlay').click('top')
    cy.get('.modal__overlay').and('not.be.visible')
    // modal closed here
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

  it('should open modal via element reference', () => {
    openModalViaElementReference()
    cy.get('#modal-1 .modal__overlay').and('be.visible')
    closeModal()
  })

  it('should close modal via element reference', () => {
    openModalViaElementReference()
    cy.get('#modal-1 .modal__overlay').and('be.visible')
    closeModalViaElementReference()
    cy.get('#modal-1 .modal__overlay').and('not.be.visible')
  })

})
