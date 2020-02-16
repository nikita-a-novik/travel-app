const formatDateInput = (input) => {
  const cleanInput = input
  .replace(/\//g, '')
  .replace(/\D/g, '')
  const month = cleanInput.substring(0,2)
  const day = cleanInput.substring(2,4)
  const year = cleanInput.substring(4,8)
  const outputDay = (day ? `/${day}` : '');
  const outputYear = (year ? `/${year}` : '')
  return `${month}` + outputDay + outputYear 
}

const isDev = false

const server = isDev ? 'http://localhost:3000' : '' 

const getWeatherData = async (location, date) => {
  const url = `${server}/weather?location=${location}&date=${date}`;
  try {
      return await fetch(url).then(res => res.json())
  } catch (e) {
      return {}
  }
}

const addTrip = async (location, date) => {
  const url = `${server}/trip`;
  try {
      return await fetch(url, { method: 'POST', headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify({ location, date }) }).then(res => res.json())
  } catch (e) {
      return {}
  }
}

const removeTrip = async (id) => {
  const url = `${server}/trip`;
  try {
      return await fetch(url, { method: 'DELETE', headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify({ id }) }).then(res => res.json())
  } catch (e) {
      return {}
  }
}

const getAllTrips = async () => {
  const url = `${server}/trip`;
  try {
      return await fetch(url).then(res => res.json())
  } catch (e) {
      return {}
  }
}

const getImage = async (location) => {
  const url = `${server}/image?location=${location}`;
  try {
      return await fetch(url).then(res => res.json())
  } catch (e) {
      console.warn(e)
      return {}
  }
}

const getDataForTrip = async (location, date) => {
  const weatherData = await getWeatherData(location, date)
  const imageUrl = await getImage(location)
  return { ...weatherData, imageUrl }
}

const getTripInput = () => {
  const { value } = document.querySelector('#location-input');
  return value;
}

const getDepartureInput = () => {
  const { value } = document.querySelector('#departure-input');
  return value;
}

document.addEventListener('getAllTrips', async () => {
  const trips = await getAllTrips()
  removeAllTrips()
  trips.forEach(t => appendTrip(t))
})

window.addEventListener('load', () => {
  console.warn('load')
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

const removeAllTrips = () => {
  const trips = Array.from(document.querySelectorAll('.trip'));
  trips.shift(); // All except the hidden element
  trips.forEach(t => t.parentElement.removeChild(t)) // Remove element
}

const appendTrip = (tripData) => {
  const {
    id,
    country,
    name,
    summary,
    temperatureHigh,
    temperatureLow,
    image,
    date,
    daysAway
  } = tripData
  const node = document.querySelector('.trip').cloneNode(true)
  node.querySelector('img').setAttribute('src', image)
  node.querySelector('.destination').innerText = `${name}, ${country}`
  node.querySelector('.high').innerText = temperatureHigh
  node.querySelector('.low').innerText = temperatureLow
  node.querySelector('.summary').innerText = summary
  node.querySelector('.days').innerText = daysAway
  node.querySelector('.departure').innerText = date
  node.setAttribute('style','')
  node.querySelector('.remove').setAttribute('id', id)
  const tripsContainer = document.querySelector('.trips')
  tripsContainer.appendChild(node);
}

document.addEventListener('click', async (e) => {
  const {
    target = {}
  } = e || {};
  if (target.className === 'add-trip') {
    const location = getTripInput()
    const date = getDepartureInput()
    await addTrip(location, date)
    document.dispatchEvent(new Event('getAllTrips'))
  } else
  if (target.className === 'remove') {
    const id = target.id
    await removeTrip(id)
    document.dispatchEvent(new Event('getAllTrips'))
  }
})

module.exports = {
  formatDateInput,
  getDataForTrip,
  getImage,
  getWeatherData
}
