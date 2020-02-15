const fetch = require('node-fetch')
const express = require('express')
const app = express();

const getParameters = (req) => {
  const {
    query: {
      location = '',
      date = ''
    }
  } = req || {}
  return { location, date }
}

app.use('/weather', async (req, res) => {
  const { location = '', date = '' } = getParameters(req);
  console.warn(location, date);
  const result = await getFutureWeatherDataForLocation(location, date, fetch);
  res.send(JSON.stringify(result));
})

app.use('/image', async (req, res) => {
  const { location = '' } = getParameters(req);
  const result = await getImageForLocation(location, fetch);
  res.send(result)
})

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
        countryName = ''
      } = {}
    ] = []
  } = rawGeoData || {}
  return {
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

const getFutureWeatherDataForLocation = async (location, dateString, fetch) => {
  const date = new Date(dateString)
  const rawGeoData = await getRawGeoDataByQuery(location, fetch)
  const geoData = getGeoData(rawGeoData)
  const rawFutureWeatherData = await getRawFutureWeatherData(geoData, date, fetch)
  const processedFutureWeatherData = getFutureWeatherData(rawFutureWeatherData)
  return processedFutureWeatherData
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
    } = {}
  } = weatherData || {};
  return summary
}

module.exports = {
  getFutureWeatherData,
  getFutureWeatherDataForLocation,
  getGeoData,
  getRawGeoDataByQuery,
  getRawFutureWeatherData,
  getUnixTimestamp,
}

app.listen(process.env.PORT || 3000,  () => console.warn('App is Running'))