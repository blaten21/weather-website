const request = require('request')

const geocode = (address, callback) => {
    const accessToken = `pk.eyJ1IjoiYmxhdGVuMjEiLCJhIjoiY2p0YWdrb3h6MGFwejQ0bWV4ZWRyZzQ0eCJ9.9AHMkvr6q-GqHrjnk9T4jw`
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${accessToken}&limit=1`

    request({ url, json: true}, (error, { body }) => {
        if (error) {
            callback('Unable to connect to Location services!')
        } else if (body.features.length === 0) {
            callback('Unable to find location. Try another search.')
        } else {
            callback(undefined, {
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name
            })
        }
    })
}

module.exports = geocode