const f = require('node-fetch')

const {
  getFutureWeatherDataForLocation,
  getGeoData,
  getRawGeoDataByQuery,
  getUnixTimestamp,
  getRawFutureWeatherData,
  getFutureWeatherData,
  generateRandomId,
  generateTripData
} = require('../server');

describe('Server', () => {
  it('should generate unique id', () => {
    console.warn(generateRandomId())
  })
  it.skip('should get geographic information based on city', async (done) => {
    const tripData = await generateTripData('Boulder', '02/15/2020', f);
    console.warn(tripData)
    done()
  })
  it.skip('should get geographic information based on city', async (done) => {
    const processedFutureWeatherData = await getFutureWeatherDataForLocation('Boulder', '02/15/2020', f);
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
