const url = require('url')
const axios = require('axios');

const API_GATEWAY_URL = process.env.API_GATEWAY_URL
    || 'http://api-gateway:4949'

const { info, error: err, notice } = require('../system/log')
const { getLoginRequest, acceptLoginRequest } = require('../lib/hydra')

const index = (req, res, next) => {
    let query = url.parse(req.url, true).query
    let challenge = query.login_challenge

    return getLoginRequest(challenge)
        .then(response => {
            if (response.skip) {
                info('Log in skipped')

                return acceptLoginRequest(challenge, {
                    subject: response.subject
                })
                    .then(response => {
                        info('Log in request accepted')

                        res.redirect(response.redirect_to)
                    })
                    .catch(error => {
                        err({
                            message: 'Log in request failed',
                            error
                        })

                        next(error)
                    })
            }

            info('Log in not skipped')

            return res.render('login', {
                csrfToken: req.csrfToken(),
                challenge: challenge,
            })
        })
        .catch(error => {
            err({
                message: 'Log in request failed',
                error
            })

            next(error)
        })
}

const store = (req, res, next) => {
    const challenge = req.body.challenge;

    axios.post(`${API_GATEWAY_URL}/auth`, {
        email: req.body.email,
        password: req.body.password
    })
        .then(response => {
            const { data: { id, name } } = response

            if (id && name) {
                info('Log in authentication passed')

                return acceptLoginRequest(challenge, {
                    subject: id,
                    remember: false,
                    remember_for: 3600,
                })
                    .then(response => {
                        info('Log in request accepted')

                        res.redirect(response.redirect_to)
                    })
                    .catch(error => {
                        err({
                            message: 'Log in request failed',
                            error
                        })

                        next(error)
                    })
            }
        })
        .catch(error => {
            notice('Log in authentication failed')

            return res.render('login', {
                csrfToken: req.csrfToken(),
                challenge: challenge,
                email: req.body.email,
                password: req.body.password,
                error: error.response.data.message,
                field: error.response.data.field
            })
        })
}

module.exports = { index, store }
