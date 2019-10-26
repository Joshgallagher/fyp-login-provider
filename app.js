const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const PORT = process.env.PORT || 3000

const { warn } = require('./system/log')
const shutdownProcess = require('./system/shutdownProcess')

const loginRoutes = require('./routes/login')
const consentRoutes = require('./routes/consent')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', loginRoutes);
app.use('/consent', consentRoutes);

const server = app.listen(PORT)

process.on('SIGINT', () => {
    warn(`Server is being stopped with signal 'SIGINT'`)

    shutdownProcess(server, process)
})

process.on('SIGTERM', () => {
    warn(`Server is being stopped with signal 'SIGTERM'`)

    shutdownProcess(server, process)
})
