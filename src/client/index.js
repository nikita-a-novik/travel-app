import './styles/style.scss'

const {
  getAllTrips,
  removeAllTrips,
  formatDateInput,
  appendTrip,
  onLoadEventListener
} = require('./js/app')

document.addEventListener('getAllTrips', async () => {
  const trips = await getAllTrips()
  removeAllTrips()
  trips.forEach(t => appendTrip(t))
})

window.addEventListener('load', onLoadEventListener)

document.addEventListener('keyup', e => {
  const {
    target = {}
  } = e || {};
  if (target.id === 'departure-input') {
    const processedValue = formatDateInput(target.value)
    target.value = processedValue
  }
})