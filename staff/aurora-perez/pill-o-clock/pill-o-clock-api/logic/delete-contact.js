const { validate } = require('pill-o-clock-utils')
const { models: { User, Drug } } = require('pill-o-clock-data')
const { NotFoundError, NotAllowedError } = require('pill-o-clock-errors')

module.exports = (id, idUserDelete) => {
    validate.string(id, 'id')
    validate.string(idUserDelete, 'idUserDelete')

    return Promise.all([User.findById(id), User.findById(idUserDelete) ])
        .then(([user, userDelete]) => {
            if (!user) throw new NotFoundError(`user with id ${id} not found`)
            if (!userDelete) throw new NotFoundError(`user with id ${idUserDelete} not found`)

            return Promise.all([User.findByIdAndUpdate(id, {$pull: {contacts: idUserDelete}}), User.findByIdAndUpdate(idUserDelete, {$pull: {contacts: id}})])
        })
        .then(() => { })
}