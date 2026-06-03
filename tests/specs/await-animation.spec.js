/* eslint-disable */

describe('Await Open Animation', function () {

  it('should successfully load', () => {
    cy.visit('/await-animation.html')
  })

  it('should not see the modal by default', () => {
    cy.get('#modal-1 .modal__overlay').and('not.be.visible')
  })

  /**
   * Regression test for setFocusToFirstNode not being bound in the constructor.
   * When awaitOpenAnimation is true, setFocusToFirstNode is passed as an animationend
   * event listener. Without .bind(this), `this` is the DOM element instead of the
   * Modal instance, causing a TypeError on this.config.disableFocus.
   */
  it('should focus the first focusable element after the open animation completes', () => {
    cy.get('#trigger').click()
    cy.get('#modal-1 .modal__overlay').should('be.visible')
    // animationend fires after the open animation; setFocusToFirstNode should then
    // move focus to the first non-close-trigger focusable element (#confirm-btn)
    cy.get('#confirm-btn').should('be.focused')
    cy.get('#modal-1 .modal__close').click()
  })

})
