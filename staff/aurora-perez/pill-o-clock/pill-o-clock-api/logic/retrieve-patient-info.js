const { validate } = require('pill-o-clock-utils')
const { models: { User } } = require('pill-o-clock-data')
const { NotFoundError, NotAllowedError } = require('pill-o-clock-errors')

module.exports = (id, patientId) => {
    validate.string(id, 'id')
    validate.string(patientId, 'patientId')

    return Promise.all([User.findById(id).lean(), User.findById(patientId).lean() ])
        .then(([user, patient]) => {
            
            if (!user) throw new NotFoundError(`user with id ${id} does not exist`)
            if (!patient) throw new NotFoundError(`user with id ${patientId} does not exist`)

            if(!user.profile === 'pharmacist') throw new NotAllowedError (`user with id ${id} is not a pharmacist`)

            if (typeof user.contacts.find(contact => contact.toString() === patientId) === 'undefined') throw new NotFoundError(`user with id ${id} does not have contact with id ${patientId}`)
            if (typeof user.contacts.find(contact => contact.toString() === patientId) === 'undefined') throw new NotFoundError(`user with id ${id} does not have contact with id ${patientId}`)

            return {progressRecordPatient: patient.progressRecord, progressPatient: patient.progress}
        })

}
