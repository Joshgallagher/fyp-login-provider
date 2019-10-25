const express = require('express')

const { index } = require('../controllers/consent')

const router = express.Router()

router.get('/', index)

module.exports = router;
