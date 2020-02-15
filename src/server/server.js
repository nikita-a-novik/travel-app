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