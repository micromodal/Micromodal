import MicroModal from './micromodal'
import './prism'

// Initial config for setting up modals
MicroModal.init({
  openTrigger: 'data-custom-open',
  disableScroll: false,
  awaitCloseAnimation: true
})

// Programmatically show modal
document.querySelector('.js-modal-trigger').addEventListener('click', function (event) {
  MicroModal.show('modal-2', {
    debugMode: true,
    disableScroll: true,
    onShow: function (modal) { document.querySelector('.js-body').classList.add(modal.id) },
    onClose: function (modal) { document.querySelector('.js-body').classList.remove(modal.id) },
    closeTrigger: 'data-custom-close',
    awaitCloseAnimation: true
  })
})

document.querySelector('.js-modal-close-trigger').addEventListener('click', function (event) {
  event.preventDefault()
  MicroModal.close('modal-2')
})

// Scrollspy
let section = document.querySelectorAll('.heading')
const sections = {}

Array.prototype.forEach.call(section, function (e) {
  sections[e.id] = e.offsetTop
})

window.onscroll = function () {
  const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop

  for (section in sections) {
    if (sections[section] <= scrollPosition) {
      document.querySelector('.active').classList.remove('blue', 'fw6', 'active')
      document.querySelector('a[href*=' + section + ']').classList.add('blue', 'fw6', 'active')
    }
  }
}
