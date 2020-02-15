function test() {
    const t = `http://api.geonames.org/search?username=nikitanovik&type=json&q=Paris`
}

const getRawGeoDataByQuery = async (location) => {
    const base = 'api.geonames.org'
    const username = 'username=nikitanovik'
    const type = 'type=json'
    const query = `q=${location}`
    const url = `http://${base}/search?${username}&${type}&${query}`
    return fetch(url).then(res => res.json())
}

const getFutureWeatherDataForLocation = async (location) => {
    const rawGeoData = await getRawGeoDataByQuery(location)
    const geoData = getGeoData(rawGeoData)
    const rawFutureWeatherData = getRawFutureWeatherData(geoData)
    const processedFutureWeatherData = getFutureWeatherData(rawFutureWeatherData)
    return processedFutureWeatherData
}
