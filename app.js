const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

const url = require('url')
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })

app.get('/', csrfProtection, (req, res) => {
    let query = url.parse(req.url, true).query
    let challenge = query.login_challenge;

    res.render('login', {
        csrfToken: req.csrfToken(),
        challenge: challenge,
    })
})

app.listen(3000, () => console.log('Login Provider is listening!'))
