const url = require('url')
const { getLoginRequest, acceptLoginRequest } = require('../lib/hydra')

const index = (req, res, next) => {
    let query = url.parse(req.url, true).query
    let challenge = query.login_challenge;

    getLoginRequest(challenge)
        .then(response => {
            console.log(response)
            if (response.skip) {
                acceptLoginRequest(challenge, {
                    subject: response.subject
                }).then(response => {
                    res.redirect(response.redirect_to);
                }).catch(error => {
                    next(error)
                })
            }

            res.render('login', {
                csrfToken: req.csrfToken(),
                challenge: challenge,
            })
        })
        .catch(error => {
            next(error)
        })
}

const store = (req, res, next) => {
    const challenge = req.body.challenge;

    // TODO: Implement custom IDP below
    if (!(req.body.email === 'foo@bar.com' && req.body.password === 'foobar')) {
        return res.render('login', {
            csrfToken: req.csrfToken(),
            challenge: challenge,
            error: 'The username / password combination is not correct'
        })
    }

    acceptLoginRequest(challenge, {
        subject: 'foo@bar.com',
        remember: Boolean(req.body.remember),
        remember_for: 3600,
    })
        .then(response => res.redirect(response.redirect_to))
        .catch(error => next(error))
}

module.exports = { index, store }
