const fetch = require("node-fetch")

const {
    formatDateInput,
    getDataForTrip
} = require('../js/app')

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
    xit('should get data for a trip', async (done) => {
        const data = await getDataForTrip('Paris', '02/15/2020')
        console.warn(data)
        done()
    })
})
