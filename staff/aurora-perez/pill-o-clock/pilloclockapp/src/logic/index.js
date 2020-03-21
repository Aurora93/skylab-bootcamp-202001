const context = require('./context')

module.exports = {
    get __context__() { return context },
    registerUser: require('./register-user'),
    login: require ('./login'),
    retrieveUser: require('./retrieve-user'),
    retrieveMedication: require('./retrieve-medication'),
    addMedication: require('./add-medication'),
    retrieveDrug: require('./retrieve-drug'),
    deleteMedication: require('./delete-medication'),
    retrieveContacts: require('./retrieve-contacts'),
    addContact: require('./add-contact'),
    deleteContact: require('./delete-contact')
}