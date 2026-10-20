/* eslint-disable */

describe('Focusable controls with aria-hidden', () => {
  const pressTab = (element, shiftKey = false) => {
    const win = element.ownerDocument.defaultView
    const event = new win.KeyboardEvent('keydown', {
      key: 'Tab', keyCode: 9, bubbles: true, cancelable: true, shiftKey
    })
    element.dispatchEvent(event)
    return event
  }

  const setLastControl = (tag, ariaHidden) => {
    cy.document().then(doc => {
      const control = doc.createElement(tag)
      control.id = 'last-control'
      control.setAttribute('aria-label', 'Final action')
      if (ariaHidden !== null) control.setAttribute('aria-hidden', ariaHidden)
      if (tag === 'select') control.appendChild(doc.createElement('option'))
      doc.getElementById('last-control').replaceWith(control)
    })
  }

  beforeEach(() => {
    cy.visit('/focusable.html')
  })

  ;['button', 'input', 'select', 'textarea'].forEach(tag => {
    ;[null, 'false'].forEach(ariaHidden => {
      const state = ariaHidden === null ? 'absent' : 'false'

      it(`does not wrap before the final ${tag} with aria-hidden ${state}`, () => {
        setLastControl(tag, ariaHidden)
        cy.get('#trigger').click()
        cy.get('#first-field').should('be.focused').then($field => {
          // A synthetic keydown does not perform the browser's default Tab.
          // Verify that MicroModal allows that default instead of wrapping early.
          expect(pressTab($field[0]).defaultPrevented).to.equal(false)
        })
      })

      it(`wraps Shift+Tab to the final ${tag} with aria-hidden ${state}`, () => {
        setLastControl(tag, ariaHidden)
        cy.get('#trigger').click()
        cy.get('#close-control').focus().then($close => {
          expect(pressTab($close[0], true).defaultPrevented).to.equal(true)
        })
        cy.get('#last-control').should('be.focused')
      })

      it(`wraps Tab from the final ${tag} with aria-hidden ${state}`, () => {
        setLastControl(tag, ariaHidden)
        cy.get('#trigger').click()
        cy.get('#last-control').focus().then($control => {
          expect(pressTab($control[0]).defaultPrevented).to.equal(true)
        })
        cy.get('#close-control').should('be.focused')
      })

      it(`initially focuses the ${tag} with aria-hidden ${state}`, () => {
        setLastControl(tag, ariaHidden)
        cy.get('#first-field').then($field => $field[0].remove())
        cy.get('#trigger').click()
        cy.get('#last-control').should('be.focused')
      })
    })

    it(`continues excluding a ${tag} with aria-hidden true`, () => {
      setLastControl(tag, 'true')
      // Keep the aria-hidden control out of the browser's native Tab order.
      cy.get('#last-control').invoke('attr', 'tabindex', '-1')
      cy.get('#trigger').click()
      cy.get('#first-field').should('be.focused').then($field => {
        expect(pressTab($field[0]).defaultPrevented).to.equal(true)
      })
      cy.get('#close-control').should('be.focused')
    })
  })
})
