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

// document.addEventListener('keydown', e => e.preventDefault())

document.addEventListener('keyup', e => {
  const {
    target = {}
  } = e || {};
  if (target.id === 'departure-input') {
    const processedValue = formatDateInput(target.value)
    target.value = processedValue
  }
})

const appendTrip = (tripData, image) => {
  const {
    country,
    name,
    summary,
    temperatureHigh,
    temperatureLow
  } = tripData
  const node = document.querySelector('.trip').cloneNode(true)
  node.querySelector('img').setAttribute('src', image)
  node.querySelector('.destination').innerText = `${name}, ${country}`
  node.querySelector('.high').innerText = temperatureHigh
  node.querySelector('.low').innerText = temperatureLow
  node.querySelector('.summary').innerText = summary
  node.setAttribute('style','')
  const tripsContainer = document.querySelector('.trips')
  tripsContainer.append(node);
}

document.addEventListener('click', async (e) => {
  const {
    target = {}
  } = e || {};
  if (target.className === 'add-trip') {
    const location = getTripInput()
    const date = getDepartureInput()
    const tripData = await getDataForTrip(location, date)
    const image = await getImage(location)
    appendTrip(tripData, image)
  }
})

module.exports = {
  formatDateInput,
  getDataForTrip,
  getImage,
  getWeatherData
}