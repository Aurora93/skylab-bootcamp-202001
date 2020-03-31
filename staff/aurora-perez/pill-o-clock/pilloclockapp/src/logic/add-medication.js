const { NotAllowedError, NotFoundError } = require( '../errors')
const { validate } = require('../utils')
const fetch = require('node-fetch') 
const context= require('./context')

/**
 * Add a prescription to user with the drug to take and the time(alarm) when the user have to take this drug 
 * 
 * @param {string} drugId the id of the drug to add to user prescription
 *
 * @param {array} time array of times in which alarms should trigger to inform the user to take the drug 
 *
 * @returns {<undefined>} an undefined on a successful addition
 * 
 * @throws {NotFoundError} if the user or the drug does not exist
 *
 * @throws {Error} if there are unkown error from the api or server's error
 */

module.exports = function (drugId, time) {
   
    validate.string(drugId, 'drugId')
    validate.type(time, 'times', Array)
    time.forEach(alarm =>{
        validate.stringOfNumbers(alarm)
    })

    return (async() => {
        const token = await this.storage.getItem('token')
   
        const response = await fetch(`${this.API_URL}/users/add-prescription`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,  
            },
            body: JSON.stringify({ drugId, time })
        })
    
        const { status } = response
        
        if (status === 201) return

        if (status >= 400 && status < 500) {
            const { error } = await response.json()

            if (status === 401) {
                throw new NotAllowedError('Ooops! You already have that medicine!')
            }

            if (status === 404) {
                throw new NotFoundError(error)
            }

            throw new Error(error)
        }

        throw new Error('server error')
    })()
    
}.bind(context)