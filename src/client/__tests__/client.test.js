const fetch = require("node-fetch")

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

const isDev = true

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

describe('Client', () => {
    it('should format date', () => {
        expect(formatDateInput('123./124./124')).toEqual('12/31/2412')
        expect(formatDateInput('')).toEqual('')
        expect(formatDateInput('2')).toEqual('2')
        expect(formatDateInput('21')).toEqual('21')
        expect(formatDateInput('21a')).toEqual('21')
        expect(formatDateInput('a21a')).toEqual('21')
        expect(formatDateInput('212')).toEqual('21/2')
        expect(formatDateInput('2132')).toEqual('21/32')
        expect(formatDateInput('21323')).toEqual('21/32/3')
        expect(formatDateInput('21/32/3')).toEqual('21/32/3')
    })
    it('should get data for a trip', async (done) => {
        const data = await getDataForTrip('Paris', '02/15/2020')
        console.warn(data)
        done()
    })
})