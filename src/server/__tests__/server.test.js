const f = require('node-fetch')

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

const getFutureWeatherDataForLocation = async (location) => {
  const rawGeoData = await getRawGeoDataByQuery(location)
  const geoData = getGeoData(rawGeoData)
  const rawFutureWeatherData = getRawFutureWeatherData(geoData)
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

describe('Server', () => {
  it.only('should get geographic information based on city', async (done) => {
    const geoData = getGeoData(await getRawGeoDataByQuery('Boulder', f))
    const date = new Date('02/16/2020')
    const weatherData = await getRawFutureWeatherData(geoData, date, f);
    const processedFutureWeatherData = getFutureWeatherData(weatherData);
    console.warn(processedFutureWeatherData)
    done()
  })
  it('should getGeoData with no parameters', async (done) => {
    getGeoData()
    done()
  })
  it('should getGeoData with no parameters', async (done) => {
    await getRawGeoDataByQuery('Montevideo', () => { throw new Error('Error') })
    done()
  })
  it('should get timestamp', () => {
    expect(getUnixTimestamp(new Date('02/15/2020'))).toBe(1581750000)
    expect(getUnixTimestamp()).toBe(0)
    expect(getUnixTimestamp({})).toBe(0)
  })
  it('should getRawFutureWeatheData', async (done) => {
    await getRawFutureWeatherData()
    done()
  })
  it('should getFutureWeatherData', async (done) => {
    getFutureWeatherData()
    done()
  })
})
