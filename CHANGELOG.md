## Release History
* **0.7.0**
    * 💡 `FEATURE` Added `MicroModal.closeAll()` to close all open modals at once - #338
    * 💡 `FEATURE` Added `MicroModal.initModal()` to register a modal dynamically after `init()` - #136, #354
    * 💡 `FEATURE` Added `MicroModal.removeModal()` to unregister a modal and clean up its event listeners - #312
    * 💡 `FEATURE` Added `MicroModal.config()` to reconfigure a modal after initialization - #354
    * 💡 `FEATURE` Support for nested (layered) modals - `Esc` closes only the topmost - #515, #544
    * 💡 `FEATURE` Setting `role="alertdialog"` on a modal now disables `Esc` to close
    * 🌀 `ENHANCEMENT` `keydown` listeners are now scoped to each modal element instead of `document` - #421, #544
    * 🌀 `ENHANCEMENT` Close trigger detection now uses `closest()` for reliable nested element handling - #490
    * 🌀 `ENHANCEMENT` `show(id, config)` reuses existing modal instances; config passed to `show()` persists on the modal - #354
    * 🌀 `ENHANCEMENT` Config passed to `init()` now applies to all subsequent `show()` calls - #354
    * 🌀 `ENHANCEMENT` Added `touchAction: none` to scroll lock for iOS momentum scroll - #509
    * 🐞 `BUGFIX` Fixed `setFocusToFirstNode` losing its context when used as an `animationend` handler with `awaitOpenAnimation: true`
    * 🐞 `BUGFIX` Fixed scroll lock being released when a nested modal closes while an outer modal is still open
    * 🐞 `BUGFIX` Fixed `keydown` handlers from multiple open modals all firing on a single `Esc` press - #421, #544
    * 🐞 `BUGFIX` Fixed `data-micromodal-close` incorrectly closing modal when clicking inside the container - #490
    * Thanks to @mike-vel for the bulk of the work in this release
* **0.6.2**
    * 🐞 `BUGFIX` Updated dependencies
* **0.6.1**
    * 🐞 `BUGFIX` Add ability to pass an element to Micromodal.close()
    * 🌀 `ENHANCEMENT` Updated documentation for show and close methods
* **0.6.0**
    * 💡 `FEATURE` Added ability to pass an element to Micromodal
* **0.5.2**
    * 🐞 `BUGFIX` Updated dependencies
* **0.4.10**
    * 🐞 `BUGFIX` Reverted passive listener to enable event methods
* **0.4.9**
    * 🐞 `BUGFIX` Correctly closes modal when clicking on nested close elements
* **0.4.8**
    * 🐞 `BUGFIX` Fixed issue where clicking on a input field would close the modal
* **0.4.7**
    * 🐞 `BUGFIX` Correctly disable scroll on iOS devices
    * 🐞 `BUGFIX` Fixed issue where 'window' would be undefined
    * 🐞 `BUGFIX` Close button works even if there are nested elements within
    * 🐞 `BUGFIX` Marks event handler as 'passive' to make the page more responsive
    * 🐞 `BUGFIX` Prevents click handlers from triggering underlying elements
* **0.4.6**
    * 🐞 `BUGFIX` Removed focus error when no focusable element exists in the modal
* **0.4.5**
    * 🐞 `BUGFIX` On open, correctly focuses on non close triggers when possible
    * 🐞 `BUGFIX` Custom open class is now properly removed on modal close
* **0.4.4**
    * 💡 `FEATURE` Added ability to customize open class name
* **0.4.3**
    * 🌀 `ENHANCEMENT` Finds a focusable element which is not the close button on modal open
    * 🌀 `ENHANCEMENT` Handle events cleanup if modals are not closed properly
    * 🌀 `ENHANCEMENT` The original trigger event is now passed to the onShow and onClose methods
    * 🌀 `ENHANCEMENT` Added engines property to package.json
    * 🐞 `BUGFIX` Fixed callbacks for programmatically toggling modal
    * 🐞 `BUGFIX` No longer intercept click events on open and close to prevent default action
    * 🐞 `BUGFIX` No longer throws error if modal has no focusable elements
    * 🐞 `BUGFIX` Setting `disableScroll` no longger changes the height of the body
    * 🐞 `BUGFIX` Fixed issue where focus trap would leak if a hidden element exists within modal
    * 🐞 `BUGFIX`  Fixed issue where active element was not being passed to the onClose method
* **0.4.2**
    * 🐞 `BUGFIX`  Fixed broken CDN link
* **0.4.1**
    * 💡 `FEATURE`  A flag to `awaitOpenAnimation` before focusing on element in modal
    * 💡 `FEATURE`  Passing actual node as second argument to `onShow`
    * 🐞 `BUGFIX`  Fixed issue where active element was `undefined`
    * 🐞 `BUGFIX`  Fixed issue where an opened modal could not be closed by `id`
* **0.4.0**
    * 💡 `FEATURE` Added abilty to close modals by ID - #113 @roebuk
    * 🐞 `BUGFIX` Fixed bug where micromodal would error on initialization - #106 @stoicsquirrel
    * 🐞 `BUGFIX` Fixed bug where IE crashed due to null reference - #171 @wcarson
    * 🐞 `BUGFIX` Fixed bug which didn't lock modal overlay in IE
* **0.3.2**
    * 🐞 `BUGFIX` Fixed bundling for es and umd builds
* **0.3.1**
    * 💡 `FEATURE` **Breaking** Renamed `hasAnimation` to `awaitCloseAnimation`
    * 🐞 `BUGFIX` Updated correct version of modal in dist
* **0.3.0**
    * 💡 `FEATURE` **Breaking** Added flag to await close animation end before destroying modal
    * 💡 `FEATURE` Added flag to disable focus on first element
    * 💡 `FEATURE` Added ability to pass custom data-attributes for open and close
    * 🐞 `BUGFIX` Fixed modal not working without animations
    * 🐞 `BUGFIX` Not focusing on last element in modal in case of file inputs
* **0.2.0**
    * 💡 `FEATURE` Added api to programmatically close modal
    * 💡 `FEATURE` Added abilty to disable scroll on modal open
    * 💡 `FEATURE` Added hooks for open/close animations
    * 💡 `FEATURE` Added flag for toggling debug logs in console
    * 🌀 `ENHANCEMENT` Added ability to pass config to `show` method
    * 🌀 `ENHANCEMENT` Cleaned up `aria` tags for accessibilty
    * 🌀 `ENHANCEMENT` Added test suite for browser tests
    * 🐞 `BUGFIX` Fixed native form events not firing in modal
    * 🐞 `BUGFIX` Fixed modal blocking custom event listeners
* **0.1.1**
    * 🐞 `BUGFIX` Fixed issue where validation was not firing
* **0.1.0**
    * 🌀 `ENHANCEMENT` Released first minor version 😊
