const url = require('url')

const { info, err } = require('../system/log')
const { getConsentRequest, acceptConsentRequest } = require('../lib/hydra')

const index = (req, res, next) => {
    const query = url.parse(req.url, true).query
    const challenge = query.consent_challenge

    return getConsentRequest(challenge)
        .then(response => {
            info('Consent request started')

            return acceptConsentRequest(challenge, {
                grant_scope: response.requested_scope,
                grant_access_token_audience: response.requested_access_token_audience,
                session: { id_token: { name: response.context.name } },
                remember: true,
                remember_for: 3600
            })
                .then(response => {
                    info('Consent request accepted')

                    res.redirect(response.redirect_to)
                })
                .catch(error => {
                    err({
                        message: 'Consent request failed',
                        error
                    })

                    next(error)
                })
        })
}

module.exports = { index }
