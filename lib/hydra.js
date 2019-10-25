const fetch = require('node-fetch')
const queryString = require('querystring')

/**
 * Ory Hydra's admin address.
 */
const hydraAdminUrl = process.env.HYDRA_ADMIN_URL || 'http://127.0.0.1:4445'

/**
 * Help method that assists in making GET requests to Ory Hydra.
 * 
 * @param {string} flow 
 * @param {string} challenge 
 */
const get = (flow, challenge) => {
    const url = new URL(`/oauth2/auth/requests/${flow}`, hydraAdminUrl)
    url.search = queryString.stringify({ [flow + '_challenge']: challenge })

    return fetch(url.toString())
        .then(function (res) {
            if (res.status < 200 || res.status > 302) {
                return res.json().then(function (body) {
                    console.error('An error occurred while making a HTTP request: ', body)
                    return Promise.reject(new Error(body.error.message))
                })
            }

            return res.json();
        })
}

/**
 * A helper method that makes PUT requests to Hydra.
 * 
 * This method takes a 'flow' (such as 'login'), an action (such as 'accept' or 'reject')
 * and a 'challenge'. This is used to make a PUT request to Ory Hydra.
 * 
 * @param {string} flow
 * @param {string} action
 * @param {string} challenge
 * @param {Object} body
 */
const put = (flow, action, challenge, body) => {
    const url = new URL(`/oauth2/auth/requests/${flow}/${action}`, hydraAdminUrl)
    url.search = queryString.stringify({ [flow + '_challenge']: challenge })

    return fetch(
        url.toString(),
        {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ).then(function (res) {
        if (res.status < 200 || res.status > 302) {
            return res.json().then(function (body) {
                console.error('An error occurred while making a HTTP request: ', body)
                return Promise.reject(new Error(body.error.message))
            })
        }

        return res.json();
    })
}

/**
 * A GET request.
 * 
 * Get's information on a login request.
 * 
 * @param {string} challenge 
 */
const getLoginRequest = (challenge) => get('login', challenge)

/**
 * A PUT request.
 * 
 * Accepts a login request.
 * 
 * @param {string} challenge 
 * @param {Object} body 
 */
const acceptLoginRequest = (challenge, body) => put('login', 'accept', challenge, body)

/**
 * A PUT request.
 * 
 * Rejects a login request.
 * 
 * @param {string} challenge 
 * @param {string} body 
 */
const rejectLoginRequest = (challenge, body) => put('login', 'reject', challenge, body)

/**
 * A GET request.
 * 
 * Get's information for a consent request.
 * 
 * @param {string} challenge 
 */
const getConsentRequest = (challenge) => get('consent', challenge)

/**
 * A PUT request.
 * 
 * Accepts a consent request.
 * 
 * @param {string} challenge 
 * @param {string} body 
 */
const acceptConsentRequest = (challenge, body) => put('consent', 'accept', challenge, body)

// TODO: Finish docblocks below

// Rejects a consent request.
const rejectConsentRequest = (challenge, body) => put('consent', 'reject', challenge, body)

// Fetches information on a logout request.
const getLogoutRequest = (challenge) => get('logout', challenge)

// Accepts a logout request.
const acceptLogoutRequest = (challenge) => put('logout', 'accept', challenge, {})

// Reject a logout request.
const rejectLogoutRequest = (challenge) => put('logout', 'reject', challenge, {})

module.exports = {
    getLoginRequest,
    acceptLoginRequest,
    rejectLoginRequest,
    getConsentRequest,
    acceptConsentRequest,
    rejectConsentRequest,
    getLogoutRequest,
    acceptLogoutRequest,
    rejectLogoutRequest
}
