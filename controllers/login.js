const url = require('url')

const { info, err, notice } = require('../system/log')
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

    // TODO: Implement custom IDP below
    if (!(req.body.email === 'foo@bar.com' && req.body.password === 'foobar')) {
        notice('Log in authentication failed')

        return res.render('login', {
            csrfToken: req.csrfToken(),
            challenge: challenge,
            error: 'The username / password combination is not correct'
        })
    }

    info('Log in authentication passed')

    return acceptLoginRequest(challenge, {
        subject: 'foo@bar.com',
        remember: Boolean(req.body.remember),
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

module.exports = { index, store }
