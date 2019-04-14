const request = require('request')

const forecast = (long, lat, callback) => {
    const url = `https://api.darksky.net/forecast/b1dc02ffad4a46c19987d99894a844e7/${long},${lat}`
    request({ url, json: true}, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service!')
        } else if (body.error) {
            callback('Unable to find location')
        } else {
            callback(undefined,`${body.daily.data[0].summary} It is currently ${body.currently.temperature.toPrecision(2)} degrees out. There is a ${body.currently.precipProbability}% chance of rain. 
            The high for today is ${body.daily.data[0].temperatureMax.toPrecision(2)} and the low is ${body.daily.data[0].temperatureMin.toPrecision(2)}`)
        }
    })
}

module.exports = forecast