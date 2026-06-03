// MicroModal.js v0.7.3
const MicroModal = (() => {
  'use strict'

  const FOCUSABLE_ELEMENTS = [
    'a[href]',
    'area[href]',
    'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
    'select:not([disabled]):not([aria-hidden])',
    'textarea:not([disabled]):not([aria-hidden])',
    'button:not([disabled]):not([aria-hidden])',
    'iframe',
    'object',
    'embed',
    '[contenteditable]',
    '[tabindex]:not([tabindex^="-"])'
  ]

  // Keep references to the options, modals, and what are opened
  const options = { openTrigger: 'data-micromodal-trigger', identifier: 'data-micromodal-id' }
  const allModals = {}
  const activeModals = []

  // Code for generating unique modal ids
  let generatedIdCount = 0
  options.generateId = () => `micromodal-${++generatedIdCount}`

  class Modal {
    constructor ({
      targetModal,
      triggers = [],
      onShow = () => {},
      onClose = () => {},
      openTrigger = 'data-micromodal-trigger',
      closeTrigger = 'data-micromodal-close',
      openClass = 'is-open',
      disableScroll = false,
      disableFocus = false,
      awaitCloseAnimation = false,
      awaitOpenAnimation = false,
      debugMode = false
    }) {
      // Save a reference of the modal
      this.modal = typeof targetModal === 'string' ? document.getElementById(targetModal) : targetModal
      this.modalId = null

      if (this.modal === null) {
        if (debugMode === true) validateModalPresence(targetModal, debugMode, false)
        return
      }

      // Save a reference to the passed config
      this.config = { debugMode, disableScroll, openTrigger, closeTrigger, openClass, onShow, onClose, awaitCloseAnimation, awaitOpenAnimation, disableFocus }

      // pre bind functions for event listeners
      this.showModal = this.showModal.bind(this)
      this.onClick = this.onClick.bind(this)
      this.onKeydown = this.onKeydown.bind(this)
      this.setFocusToFirstNode = this.setFocusToFirstNode.bind(this)

      // Register click events only if pre binding eventListeners
      this.triggers = triggers
      this.registerTriggers()
    }

    /**
     * Loops through all openTriggers and binds click event
     */
    registerTriggers () {
      this.triggers.filter(Boolean).forEach(trigger => {
        trigger.addEventListener('click', this.showModal)
      })
    }

    unregisterTriggers () {
      this.triggers.filter(Boolean).forEach(trigger => {
        trigger.removeEventListener('click', this.showModal)
      })
    }

    /**
     * Hide modal and remove event listeners and triggers
     */
    destroy () {
      this.closeModal()
      this.unregisterTriggers()
    }

    showModal (event = null) {
      if (this.modal.classList.contains(this.config.openClass)) return // guard against multiple calls

      this.removeEventListeners() // clear events in case previous modal wasn't closed

      this.activeElement = document.activeElement
      this.modal.setAttribute('aria-hidden', 'false')
      this.modal.classList.add(this.config.openClass)
      this.toggleScrolling(false) // disable scrolling
      this.addEventListeners()

      // stores reference to active modal
      if (this.modalId && activeModals.indexOf(this.modalId) === -1) activeModals.push(this.modalId)

      if (this.config.awaitOpenAnimation) {
        this.modal.addEventListener('animationend', this.setFocusToFirstNode, { once: true })
      } else {
        this.setFocusToFirstNode()
      }

      this.config.onShow(this.modal, this.activeElement, event)
    }

    closeModal (event = null) {
      const modal = this.modal
      const openClass = this.config.openClass // <- old school ftw
      if (!modal.classList.contains(openClass)) return // guard for animationend being called twice

      // remove from activeModals if present
      const idx = activeModals.indexOf(this.modalId)
      if (idx > -1) activeModals.splice(idx, 1)

      this.modal.setAttribute('aria-hidden', 'true')
      this.removeEventListeners()
      this.toggleScrolling(true) // enable scrolling

      if (this.activeElement && this.activeElement.focus) {
        this.activeElement.focus()
      }
      this.config.onClose(this.modal, this.activeElement, event)

      if (this.config.awaitCloseAnimation) {
        this.modal.addEventListener('animationend', function () {
          modal.classList.remove(openClass)
        }, { once: true })
      } else {
        modal.classList.remove(openClass)
      }
    }

    toggleScrolling (value) {
      if (!this.config.disableScroll) return
      // const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = (!value) ? 'hidden' : ''
      document.body.style.touchAction = (!value) ? 'none' : '' // for mobile scrolling

      // Compensate layout shifts for missing scrollbars
      // document.body.style.paddingRight = (!value) ? `${scrollbarWidth}px` : ''
    }

    addEventListeners () {
      this.modal.addEventListener('click', this.onClick)
      this.modal.addEventListener('keydown', this.onKeydown)

      // only bind global keydown if this is the first modal to open
      if (!this.modalId) {
        document.removeEventListener('keydown', globalKeydownHandler) // just in case
      } else if (activeModals.length === 0) {
        document.addEventListener('keydown', globalKeydownHandler)
      }
    }

    removeEventListeners () {
      this.modal.removeEventListener('click', this.onClick)
      this.modal.removeEventListener('keydown', this.onKeydown)

      // only remove global keydown if no more modals are open
      if (activeModals.length === 0) document.removeEventListener('keydown', globalKeydownHandler)
    }

    /**
     * Handles all click events from the modal.
     * Closes modal if a target matches the closeTrigger attribute.
     * @param {*} event Click Event
     */
    onClick (event) {
      const overlayClicked = isOverlay(event.target, this.modal)
      const closestElement = event.target.closest(`[${ this.config.closeTrigger }]`) // eslint-disable-line template-curly-spacing
      if (
        (event.target.hasAttribute(this.config.closeTrigger) && overlayClicked) || // clicked on modal overlay
        (closestElement !== null && !isOverlay(closestElement, this.modal) && !overlayClicked) // clicked on a close trigger inside modal
      ) {
        event.preventDefault()
        event.stopPropagation()
        this.closeModal(event)
      }
    }

    onKeydown (event) {
      // close modal on esc key press unless the modal is an alertdialog
      if ((event.key === 'Escape' || event.keyCode === 27) && this.modal.querySelector('[role="alertdialog"]') === null) this.closeModal(event)

      // ...and trap focus on tab key press
      if (event.key === 'Tab' || event.keyCode === 9) this.retainFocus(event, 'inside')
    }

    getFocusableNodes () {
      const nodes = this.modal.querySelectorAll(FOCUSABLE_ELEMENTS)
      return [...nodes]
    }

    /**
     * Tries to set focus on a node which is not a close trigger
     * if no other nodes exist then focuses on first close trigger
     */
    setFocusToFirstNode () {
      if (this.config.disableFocus) return

      const focusableNodes = this.getFocusableNodes()

      // no focusable nodes
      if (focusableNodes.length === 0) return

      // remove nodes on whose click, the modal closes
      // could not think of a better name :(
      const nodesWhichAreNotCloseTargets = focusableNodes.filter(node => {
        return !node.hasAttribute(this.config.closeTrigger)
      })

      if (nodesWhichAreNotCloseTargets.length > 0) nodesWhichAreNotCloseTargets[0].focus()
      if (nodesWhichAreNotCloseTargets.length === 0) focusableNodes[0].focus()
    }

    retainFocus (event, focusTrap) {
      let focusableNodes = this.getFocusableNodes()

      // no focusable nodes
      if (focusableNodes.length === 0) return

      /**
       * Filters nodes which are hidden to prevent
       * focus leak outside modal
       */
      focusableNodes = focusableNodes.filter(node => {
        return (node.offsetParent !== null)
      })

      if (focusTrap === 'outside') {
        // prevents outside focus leak especially if disableFocus is true
        focusableNodes[0].focus()
        event.preventDefault()
      } else {
        // prevents the focus inside the modal from going out
        const focusedItemIndex = focusableNodes.indexOf(document.activeElement)

        // Shift + Tab on first focusable node
        if (event.shiftKey && focusedItemIndex === 0) {
          focusableNodes[focusableNodes.length - 1].focus()
          event.preventDefault()
        }

        // Tab on last focusable node
        if (!event.shiftKey && focusableNodes.length > 0 && focusedItemIndex === focusableNodes.length - 1) {
          focusableNodes[0].focus()
          event.preventDefault()
        }
      }
    }
  }

  /**
   * Modal prototype ends.
   * Here on code is responsible for detecting and
   * auto binding event handlers on modal triggers
   */

  const getTargetId = (modal) => {
    if (typeof modal === 'string') return modal

    // If an HTML element is passed, try to derive the id or generate one
    if (modal instanceof HTMLElement) { // eslint-disable-line no-undef
      // We prefer the data-micromodal-id attribute
      let targetId = modal.getAttribute(options.identifier)
      if (targetId) return targetId

      // If that doesn't exist, we try the id attribute
      if (modal.id) return modal.id

      // Otherwise, generate a new unique id
      targetId = options.generateId()
      modal.setAttribute(options.identifier, targetId)
      return targetId
    }

    // If neither a string or HTMLElement was passed, return null
    return null
  }

  const globalKeydownHandler = (event) => {
    const topModal = allModals[activeModals[activeModals.length - 1]]
    if (topModal.modal.contains(document.activeElement)) return // prevent double handling of events

    // close modal on esc key press unless the modal is an alertdialog
    if ((event.key === 'Escape' || event.keyCode === 27) && topModal.modal.querySelector('[role="alertdialog"]') === null) close()

    // ...and trap focus on tab key press
    if (event.key === 'Tab' || event.keyCode === 9) topModal.retainFocus(event, 'outside')
  }

  const isOverlay = (element, modal) => {
    return element === modal || element.parentNode === modal
  }

  /**
   * Generates an associative array of modals and it's
   * respective triggers
   * @param  {array} triggers     An array of all triggers
   * @param  {string} triggerAttr The data-attribute which triggers the module
   * @return {array}
   */
  const generateTriggerMap = (triggers, triggerAttr) => {
    const triggerMap = []

    triggers.forEach(trigger => {
      const targetModal = trigger.getAttribute(triggerAttr)
      if (!triggerMap[targetModal]) triggerMap[targetModal] = []
      triggerMap[targetModal].push(trigger)
    })

    return triggerMap
  }

  /**
   * Validates whether a modal of the given id exists
   * in the DOM
   * @param  {string|object} modal the html ID of the modal, or the modal element itself
   * @param  {boolean} debugMode determines whether to log errors
   * @param  {boolean} registered if the modal is already registered with MicroModal
   * @return {boolean}
   */
  const validateModalPresence = (modal, debugMode, registered = true) => {
    let modalExists
    if (registered) {
      modalExists = allModals[modal] !== undefined
    } else {
      modalExists = typeof modal === 'string' ? document.getElementById(modal) !== null : modal instanceof HTMLElement // eslint-disable-line no-undef
    }
    if (!modalExists) {
      if (debugMode) {
        console.warn(
          `MicroModal: \u2757Seems like you have missed %c'${modal}'%c ID somewhere in your code. Try the example below to resolve it.\n\n` +
          `%cExample:%c <div class="modal" id="${modal}"></div>`,
          'background-color: #f8f9fa;color: #50596c;font-weight: bold;', '', 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', ''
        )
      }
      return false
    }
    return true
  }

  /**
   * Validates if there are modal triggers present
   * in the DOM
   * @param  {array} triggers An array of data-triggers
   * @return {boolean}
   */
  const validateTriggerPresence = triggers => {
    if (triggers.length <= 0) {
      console.warn(
        'MicroModal: \u2757Please specify at least one %c\'micromodal-trigger\'%c data attribute.\n\n' +
        '%cExample:%c <a href="#" data-micromodal-trigger="my-modal">Open modal</a>',
        'background-color: #f8f9fa;color: #50596c;font-weight: bold;', '', 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', ''
      )
      return false
    }
    return true
  }

  /**
   * Binds click handlers to all modal triggers
   * @param  {object} config [description]
   * @return void
   */
  const init = config => {
    // Modifies the options
    Object.assign(options, config)

    // Collects all the nodes with the trigger
    const triggers = [...document.querySelectorAll(`[${ options.openTrigger }]`)] // eslint-disable-line template-curly-spacing

    // Makes a mappings of modals with their trigger nodes
    const triggerMap = generateTriggerMap(triggers, options.openTrigger)

    // Checks if modals and triggers exist in dom
    if (options.debugMode === true && validateTriggerPresence(triggers) === false) return

    // For every target modal creates a new instance
    Object.keys(triggerMap).forEach(key => {
      const value = triggerMap[key]
      initModal(key, { targetModal: key, triggers: value })
    })
  }

  /**
   * Binds click handlers in a new modal
   * @param  {string|object} targetModal [The id of the modal to initialize]
   * @param  {object} config [description]
   * @return {void}
   */
  const initModal = (targetModal, config = {}) => {
    const modalConfigs = Object.assign({}, options, { targetModal }, config)
    const targetId = getTargetId(targetModal)

    // Checks if a modal exists in dom
    if (!validateModalPresence(modalConfigs.targetModal, modalConfigs.debugMode, false)) return
    if (allModals[targetId]) return // already initialized

    allModals[targetId] = new Modal(modalConfigs) // eslint-disable-line no-new

    // Reference the id on the modal
    allModals[targetId].modal.setAttribute(options.identifier, targetId)
    allModals[targetId].modalId = targetId
  }

  /**
   * Modifies the modal properties including the show and hide listeners.
   * Does not change trigger elements
   * @param  {string|object} targetModal [The id of the modal to configure]
   * @param  {object} config [The configuration object to pass]
   * @return {void}
   */
  const configModal = (targetModal, config) => {
    const targetId = getTargetId(targetModal)
    if (validateModalPresence(targetId, options.debugMode)) Object.assign(allModals[targetId].config, config)
  }

  /**
   * Shows a particular modal
   * @param  {string|object} targetModal [The id of the modal to display]
   * @param  {object} config [The configuration object to pass]
   * @return {void}
   */
  const show = (targetModal, config) => {
    const targetId = getTargetId(targetModal)

    if (!allModals[targetId]) {
      initModal(targetId, config)
    } else if (config) {
      configModal(targetModal, config)
    }

    if (allModals[targetId]) allModals[targetId].showModal()
  }

  /**
   * Closes the active modal
   * @param  {string|object} targetModal The id of the modal to close, or the modal element itself
   * @return {void}
   */
  const close = targetModal => {
    if (activeModals.length === 0) return // guard against no open modals
    if (targetModal) {
      // Closes the modal that matches the id
      const targetId = getTargetId(targetModal)

      if (activeModals.indexOf(targetId) > -1) allModals[targetId].closeModal()
    } else {
      // Closes the most recent one
      allModals[activeModals[activeModals.length - 1]].closeModal()
    }
  }

  /**
   * Closes all active modals
   */
  const closeAll = () => {
    for (let i = activeModals.length - 1; i >= 0; i--) allModals[activeModals[i]].closeModal()
  }

  /**
   * Removes a modal from the allModals list.
   * Hides the modal and removes all event listeners and triggers before removing.
   * @param {string|object} targetModal The id of the modal to remove, or the modal element itself
   * @return {void}
   */
  const removeModal = (targetModal) => {
    const targetId = getTargetId(targetModal)
    const modalInstance = allModals[targetId]
    if (modalInstance) {
      // Hide modal and remove event listeners and triggers
      modalInstance.destroy()

      // Remove from allModals
      delete allModals[targetId]
    }
  }

  // Public APIs
  const exported = Modal
  Object.assign(exported, { init, initModal, config: configModal, show, close, closeAll, removeModal, options })

  // Object.assign(exported, { allModals, get activeModals () { return activeModals } })
  return exported
})()

export default MicroModal

if (typeof window !== 'undefined') {
  window.MicroModal = MicroModal
}
