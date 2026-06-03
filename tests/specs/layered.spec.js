/* eslint-disable */

afterEach(function () {
  if (this.currentTest.state === 'failed') {
    Cypress.runner.stop()
  }
});

describe('Layered Modals', function () {

  const openModal1 = () => {
    cy.get('[data-micromodal-trigger="modal-1"]').first().click()
  }

  const openModal2FromTrigger = () => {
    cy.get('[data-micromodal-trigger="modal-2"]').first().click()
  }

  const openModal2FromInsideModal1 = () => {
    cy.get('#trigger-2').click()
  }

  const closeModal1 = () => {
    cy.get('#modal-1 .modal__close').click()
  }

  const closeModal2 = () => {
    cy.get('#modal-2 .modal__close').click()
  }

  it('should successfully load', () => {
    cy.visit('/layered.html')
  })

  it('should not see either modal by default', () => {
    cy.get('#modal-1 .modal__overlay').and('not.be.visible')
    cy.get('#modal-2 .modal__overlay').and('not.be.visible')
  })

  it('should open modal-1 on trigger click', () => {
    openModal1()
    cy.get('#modal-1 .modal__overlay').should('be.visible')
    closeModal1()
  })

  it('should close modal-1 on close button click', () => {
    openModal1()
    closeModal1()
    cy.get('#modal-1 .modal__overlay').should('not.be.visible')
  })

  it('should open modal-2 from inside modal-1', () => {
    openModal1()
    openModal2FromInsideModal1()
    cy.get('#modal-2 .modal__overlay').should('be.visible')
    closeModal2()
    closeModal1()
  })

  it('should keep modal-1 open when modal-2 is closed', () => {
    openModal1()
    openModal2FromInsideModal1()
    closeModal2()
    cy.get('#modal-2 .modal__overlay').should('not.be.visible')
    cy.get('#modal-1 .modal__overlay').should('be.visible')
    closeModal1()
  })

  it('should close topmost modal (modal-2) on esc when both are open', () => {
    openModal1()
    openModal2FromInsideModal1()
    cy.get('body').type('{esc}')
    cy.get('#modal-2 .modal__overlay').should('not.be.visible')
    cy.get('#modal-1 .modal__overlay').should('be.visible')
    closeModal1()
  })

  it('should close modal-1 on esc when only modal-1 is open', () => {
    openModal1()
    cy.get('body').type('{esc}')
    cy.get('#modal-1 .modal__overlay').should('not.be.visible')
  })

  it('should toggle aria-hidden on modal-1', () => {
    cy.get('#modal-1').should('have.attr', 'aria-hidden', 'true')
    openModal1()
    cy.get('#modal-1').should('have.attr', 'aria-hidden', 'false')
    closeModal1()
    cy.get('#modal-1').should('have.attr', 'aria-hidden', 'true')
  })

  it('should toggle aria-hidden on modal-2 independently', () => {
    openModal1()
    cy.get('#modal-2').should('have.attr', 'aria-hidden', 'true')
    openModal2FromInsideModal1()
    cy.get('#modal-2').should('have.attr', 'aria-hidden', 'false')
    closeModal2()
    cy.get('#modal-2').should('have.attr', 'aria-hidden', 'true')
    closeModal1()
  })

  it('should fire onShow callback when opening modal-1', () => {
    openModal1()
    cy.get('body').should('have.class', 'howdy')
    closeModal1()
  })

  it('should fire onClose callback when closing modal-1', () => {
    openModal1()
    closeModal1()
    cy.get('body').should('not.have.class', 'howdy')
  })

  it('should close all modals via closeAll()', () => {
    openModal1()
    openModal2FromInsideModal1()
    cy.window().then(win => win.MicroModal.closeAll())
    cy.get('#modal-1 .modal__overlay').should('not.be.visible')
    cy.get('#modal-2 .modal__overlay').should('not.be.visible')
  })

  it('should apply custom open class', () => {
    openModal1()
    cy.get('#modal-1').should('have.class', 'open')
    closeModal1()
    cy.get('#modal-1').should('not.have.class', 'open')
  })

})

/**
 * Regression tests for disableScroll with nested modals.
 * Closing an inner modal should not re-enable scrolling while an outer modal is still open.
 */
describe('Scroll lock with nested modals', function () {

  before(() => {
    cy.window().then(win => {
      win.MicroModal.config('modal-1', { disableScroll: true })
      win.MicroModal.config('modal-2', { disableScroll: true })
    })
  })

  const checkOverflow = (expected) => {
    cy.window().then(win => {
      expect(win.document.body.style.overflow).to.equal(expected)
    })
  }

  it('should lock scroll when a modal opens and unlock when it closes', () => {
    cy.get('[data-micromodal-trigger="modal-1"]').first().click()
    checkOverflow('hidden')
    cy.get('#modal-1 .modal__close').click()
    checkOverflow('')
  })

  it('should keep scroll locked when the inner modal closes but the outer is still open', () => {
    cy.get('[data-micromodal-trigger="modal-1"]').first().click()
    cy.get('#trigger-2').click()
    checkOverflow('hidden')
    cy.get('#modal-2 .modal__close').click()
    checkOverflow('hidden') // outer modal (modal-1) is still open — scroll must stay locked
    cy.get('#modal-1 .modal__close').click()
    checkOverflow('')
  })

})
