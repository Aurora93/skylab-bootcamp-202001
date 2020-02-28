const { validate } = require('../utils')
const { users } = require('../data')
const { NotFoundError, NotAllowedError } = require('../errors')

const fs = require('fs').promises
const path = require('path')

module.exports = id => {
    validate.string(id, 'id')

    const user = users.find(user => user.id === id )

    if (!user) throw new NotFoundError(`user with id ${id} does not exists`)

    if (user.deactivated) throw new NotAllowedError(`user with id ${id} is deactivated`)

    user.retrieved = new Date

    return fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4))
    
    .then(()=> {
        const {name, surname, email} = user
        
        return {name, surname, email}
    })
    
}