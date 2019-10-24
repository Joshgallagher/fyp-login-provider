const express = require('express')
const csrf = require('csurf')
const { index, store } = require('../controllers/login')

const router = express.Router()
const csrfProtection = csrf({ cookie: true })

router.get('/', csrfProtection, index)
router.post('/', csrfProtection, store)

module.exports = router
