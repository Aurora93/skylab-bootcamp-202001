module.exports = {
    registerUser: require('./register-user'),
    authenticateUser: require('./authenticate-user'),
    retrieveUser: require('./retrieve-user'),
    addMedication: require('./add-medication'),
    deleteMedication: require('./delete-medication'),
    retrievePrescriptedMedication: require('./retrieve-prescripted-medication'),
    addPrescription: require('./add-prescription'),
    retrievePrescription: require('./retrieve-prescription'),
    deletePrescription: require('./delete-prescription'),
    addProgress: require('./add-progress'),
    retrieveProgress: require('./retrieve-progress'),
    addContact: require('./add-contact'),
    retrieveDrug: require('./retrieve-drug'),
    retrieveContacts: require('./retrieve-contacts'),
    deleteContact: require('./delete-contact')
}