/* global cy, describe, beforeEach, it */

describe('Visible focus candidates', () => {
  beforeEach(() => {
    cy.visit('/focus.html')
    cy.get('#trigger').click()
  })

  it('skips CSS-hidden nodes when opening and wrapping focus', () => {
    cy.get('#first').should('be.focused')
    cy.get('#first').trigger('keydown', { key: 'Tab', shiftKey: true })
    cy.get('#close').should('be.focused')
    cy.get('#close').trigger('keydown', { key: 'Tab' })
    cy.get('#first').should('be.focused')
  })

  it('keeps fixed-position nodes and rechecks visibility on each Tab', () => {
    cy.get('#first').invoke('css', 'display', 'none')
    cy.get('#close').focus().trigger('keydown', { key: 'Tab' })
    cy.get('#fixed').should('be.focused')
    cy.get('#outside').focus().trigger('keydown', { key: 'Tab' })
    cy.get('#fixed').should('be.focused')
  })

  it('falls back to the visible close trigger', () => {
    cy.get('#first, #fixed').invoke('css', 'display', 'none')
    cy.get('#close').click()
    cy.get('#trigger').should('be.focused').click()
    cy.get('#close').should('be.focused')
  })

  it('does not throw if all candidates become hidden', () => {
    cy.get('#modal button').invoke('css', 'display', 'none')
    cy.get('#outside').focus().trigger('keydown', { key: 'Tab' })
    cy.get('#outside').should('be.focused')
  })
})
