const getRawGeoDataByQuery = async (location) => {
    const base = 'api.geonames.org'
    const username = 'username=nikitanovik'
    const type = 'type=json'
    const query = `q=${location}`
    const url = `http://${base}/search?${username}&${type}&${query}`
    return fetch(url).then(res => res.json())
}

describe('Server', () => {
    it('should get geographic information based on city', async (done) => {
        const result = await getRawGeoDataByQuery('Norilsk')
        console.warn(result)
        done()
    })
})
