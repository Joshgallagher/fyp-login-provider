const url = require('url')
const { getConsentRequest, acceptConsentRequest } = require('../lib/hydra')

const index = (req, res, next) => {
    const query = url.parse(req.url, true).query
    const challenge = query.consent_challenge

    return getConsentRequest(challenge)
        .then(response => {
            return acceptConsentRequest(challenge, {
                grant_scope: response.requested_scope,
                grant_access_token_audience: response.requested_access_token_audience,
                session: {
                    id_token: {
                        // Data for ID token
                    }
                },
                remember: true,
                remember_for: 3600
            })
                .then(response => res.redirect(response.redirect_to))
                .catch(error => next(error))
        })
}

module.exports = { index }
