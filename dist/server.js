const fetch = require('node-fetch')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const app = express();

// Storage

let trips = [];

// Endpoints

app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '.')))

app.post('/trip', async (req, res) => {
  console.warn(req.body)
  const { location, date } = getTripInformation(req)
  trips = [(await generateTripData(location, date, fetch)), ...trips]
  res.send({})
})

app.delete('/trip', (req, res) => {
  const id = getTripIdFromRequest(req)
  trips = trips.filter(i => i.id !== id)
  res.send({})
})

app.get('/trip', (req, res) => {
  res.send(JSON.stringify(trips))
})

app.use('/weather', async (req, res) => {
  const { location = '', date = '' } = getParameters(req);
  console.warn(location, date);
  const result = await getFutureWeatherDataForLocation(location, date, fetch);
  res.send(JSON.stringify(result));
})

app.use('/image', async (req, res) => {
  const { location = '' } = getParameters(req);
  const result = await getImageForLocation(location, fetch);
  res.send(JSON.stringify(result))
})

// Logic

// This is the simplest way I found
// to create a unique id
const generateRandomId = () => `\
${Math.round(Math.random()*10000)}-\
${Math.round(Math.random()*10000)}-\
${Math.round(Math.random()*10000)}-\
${Math.round(Math.random()*10000)}`

const generateTripData = async (location, date, fetch) => ({
  id: generateRandomId(),
  // I want to get data from the combined endpoints
  // (it will be an object) and spread it here.
  // All I really need is to put an id on top of it,
  // so that I can later delete it or update it...
  ...(await getFutureWeatherDataForLocation(location, date, fetch))
})

const getTripIdFromRequest = (req) => {
  const {
    body: {
      id = ''
    } = {}
  } = req
  return id
}

const getTripInformation = (req) => {
  const {
    body: {
      location = '',
      date = ''
    } = {}
  } = req
  return { location, date }
}

const getParameters = (req) => {
  const {
    query: {
      location = '',
      date = ''
    }
  } = req || {}
  return { location, date }
}

const getRawGeoDataByQuery = async (location, fetch) => {
  const base = 'api.geonames.org'
  const username = 'username=nikitanovik'
  const type = 'type=json'
  const query = `q=${location}`
  const url = `http://${base}/search?${username}&${type}&${query}`
  try {
    return await fetch(url).then(res => res.json())
  } catch (e) {
    return {}
  }
}

const getGeoData = (rawGeoData) => {
  const {
    geonames: [
      {
        lng = 0,
        lat = 0,
        name = '',
        countryName = '',
      } = {}
    ] = []
  } = rawGeoData || {}
  return {
    name,
    longitude: lng,
    latitude: lat,
    country: countryName
  }
}

const getUnixTimestamp = (date) => {
  try {
    return Math.round(date.getTime() / 1000);
  } catch (e) {
    return 0
  }
}

const getRawFutureWeatherData = async (geoData, date, fetch) => {
  const timestamp = getUnixTimestamp(date)
  const { longitude = 0, latitude = 0 } = geoData || {}
  const base = 'api.darksky.net'
  const key = '23944bc9ab2bd4c11b082c0bc9895c0f'
  const url = `https://${base}/forecast/${key}/${latitude},${longitude},${timestamp}`
  try {
    return await fetch(url).then(res => res.json())
  } catch (e) {
    return {}
  }
}

const getDaysAway = (date) => {
  const currentTime = new Date().valueOf()
  const travelTime = date.valueOf()
  const daysLeft = Math.round((travelTime - currentTime) / (1000 * 60 * 60 * 24))
  return daysLeft
}

const getFutureWeatherDataForLocation = async (location, dateString, fetch) => {
  const date = new Date(dateString)
  const rawGeoData = await getRawGeoDataByQuery(location, fetch)
  const geoData = getGeoData(rawGeoData)
  const rawFutureWeatherData = await getRawFutureWeatherData(geoData, date, fetch)
  const summary = getFutureWeatherData(rawFutureWeatherData)
  const image = await getImageForLocation(location, fetch)
  const daysAway = getDaysAway(date)
  console.warn(image);
  return { ...summary, ...geoData, image, daysAway, date: dateString }
}

const getRawImageDataForLocation = async (location, fetch) => {
  const key = 'key=15275803-5dc29be62cd1ecb796af7c462'
  const query = `q=${location}`
  const base = 'pixabay.com/api'
  const url = `https://${base}/?${key}&${query}`
  try {
    return await fetch(url).then(res => res.json())
  } catch (e) {
    return {}
  }
}

const getImageForLocation = async (location, fetch) => {
  const {
    hits: [
      {
        webformatURL = ''
      } = {}
    ] = []
  } = await getRawImageDataForLocation(location, fetch) || {}
  return webformatURL;
}

const getFutureWeatherData = (weatherData) => {
  const {
    currently: {
      summary = ''
    } = {},
    daily: {
      data: [
        {
          temperatureLow = 0,
          temperatureHigh = 0
        } = {}
      ] = []
    } = {}
  } = weatherData || {};
  return {
    summary,
    temperatureHigh,
    temperatureLow 
  }
}

module.exports = {
  getFutureWeatherData,
  getFutureWeatherDataForLocation,
  getGeoData,
  getRawGeoDataByQuery,
  getRawFutureWeatherData,
  getUnixTimestamp,
  generateRandomId,
  generateTripData
}

app.listen(process.env.PORT || 3000,  () => console.warn('App is Running'))
