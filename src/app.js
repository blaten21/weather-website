const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require(`./utils/geocode.js`)
const forecast = require(`./utils/forecast`)


const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, `../templates/views`)
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(path.join(publicDirPath)))

const creator = "Sayre Couto"

app.get('', (req, res) => {
    res.render('index', {
        title: `Sayre's Badass Website`, 
        name: creator
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: creator
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'This is the help page',
        title: 'Help',
        name: creator
    })
})

app.get('/my/next/page', (req, res) => {
    res.render('mike')
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        })
    }
    const address = req.query.address
    geocode(address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                forecast: forecastData,
                location,
                address: address
            })
        })
    })

})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    res.send({
        products: []
    })
})

app.get(`/help/*`, (req, res) => {
    res.render('404', {
        title: '404 Help',
        name: 'Michael Kaiser',
        eMessage: 'Help article not found.'
    })
})

app.get('/ixchel/babemomma', (req, res) => {
    res.render('ixchel', {
        title: 'Hot Momma!!!'
    })
})

app.get('/sayre/cutegifs', (req, res) => {
    res.render('sayre', {
        title: `Sayre's cute gifs`
    })
})

app.get('/kaiser/auth', (req, res) => {
    const poi = req.query.pnm_order_identifier
    const spi = 12345

    res.send(`<?xml version="1.0"?>
    <t:payment_authorization_response xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:t='http://www.paynearme.com/api/pnm_xmlschema_v2_0' version='2.0'>
      <t:authorization>
        <t:pnm_order_identifier>${poi}</t:pnm_order_identifier>
        <t:site_payment_identifier>${spi}</t:site_payment_identifier>
        <t:accept_payment>yes</t:accept_payment>
      </t:authorization>
    </t:payment_authorization_response>`)

})

app.get('/kaiser/confirm', (req, res) => {
    const ppi = req.query.pnm_payment_identifier

    res.send(`<?xml version="1.0"?>
    <t:payment_confirmation_response xmlns:t="http://www.paynearme.com/api/pnm_xmlschema_v2_0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="2.0">
      <t:confirmation>
        <t:pnm_payment_identifier>${ppi}</t:pnm_payment_identifier>
      </t:confirmation>
    </t:payment_confirmation_response>`)

})

app.get(`*`, (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Michael Kaiser',
        eMessage: 'Page not found'
    })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})