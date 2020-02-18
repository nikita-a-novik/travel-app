import './styles/style.scss'

const {
  getAllTrips,
  removeAllTrips,
  formatDateInput,
  appendTrip
} = require('./js/app')

document.addEventListener('getAllTrips', async () => {
  const trips = await getAllTrips()
  removeAllTrips()
  trips.forEach(t => appendTrip(t))
})

window.addEventListener('load', () => {
  removeAllTrips()
  document.dispatchEvent(new Event('getAllTrips'))
})

document.addEventListener('keyup', e => {
  const {
    target = {}
  } = e || {};
  if (target.id === 'departure-input') {
    const processedValue = formatDateInput(target.value)
    target.value = processedValue
  }
})