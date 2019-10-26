const fetch = require('node-fetch')
const queryString = require('querystring')
const statusCode = require('http-status-codes')

const { error } = require('../system/log')

/**
 * Ory Hydra's admin address.
 */
const HYDRA_ADMIN_URL = process.env.HYDRA_ADMIN_URL || 'http://127.0.0.1:4445'

/**
 * Help method that assists in making GET requests to Ory Hydra.
 * 
 * @param {string} flow 
 * @param {string} challenge 
 */
const get = (flow, challenge) => {
    const url = new URL(`/oauth2/auth/requests/${flow}`, HYDRA_ADMIN_URL)
    url.search = queryString.stringify({ [flow + '_challenge']: challenge })

    return fetch(url.toString())
        .then(res => {
            if (res.status < statusCode.OK || res.status > statusCode.MOVED_TEMPORARILY) {
                return res.json()
                    .then(body => {
                        error({
                            message: 'Hydra GET request failed',
                            error: body.error
                        })

                        Promise.reject(new Error(body.error.message))
                    })
            }

            return res.json()
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
    const url = new URL(`/oauth2/auth/requests/${flow}/${action}`, HYDRA_ADMIN_URL)
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
    ).then(res => {
        if (res.status < statusCode.OK || res.status > statusCode.MOVED_TEMPORARILY) {
            return res.json()
                .then(body => {
                    error({
                        message: 'Hydra PUT request failed',
                        error: body.error
                    })

                    Promise.reject(new Error(body.error.message))
                })
        }

        return res.json()
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
 * Accept a login request.
 * 
 * @param {string} challenge 
 * @param {Object} body 
 */
const acceptLoginRequest = (challenge, body) => put('login', 'accept', challenge, body)

/**
 * A PUT request.
 * 
 * Reject a login request.
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
 * Accept a consent request.
 * 
 * @param {string} challenge 
 * @param {string} body 
 */
const acceptConsentRequest = (challenge, body) => put('consent', 'accept', challenge, body)

/**
 * A PUT method.
 * 
 * Reject a consent request.
 * 
 * @param {string} challenge 
 * @param {string} body 
 */
const rejectConsentRequest = (challenge, body) => put('consent', 'reject', challenge, body)

/**
 * A GET request.
 * 
 * Get's information for a logout request.
 * 
 * @param {string} challenge 
 */
const getLogoutRequest = (challenge) => get('logout', challenge)

/**
 * A PUT request.
 * 
 * Accept a logout request.
 * 
 * @param {string} challenge 
 */
const acceptLogoutRequest = (challenge) => put('logout', 'accept', challenge, {})

// Reject a logout request.
/**
 * A PUT method.
 * 
 * Reject a logout request.
 * 
 * @param {string} challenge 
 */
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
