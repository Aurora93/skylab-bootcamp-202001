const { Router } = require('express')
const {
    registerUser,
    authenticateUser,
    retrieveUser,
    addMedication,
    deleteMedication,
    retrievePrescriptedMedication,
    addPrescription,
    retrievePrescription,
    deletePrescription,
    addProgress,
    retrieveProgress,
    retrieveDrug,
    retrieveContacts,
    addContact,
    deleteContact
} = require('./handlers')

const { jwtVerifierMidWare } = require('../mid-wares')
const bodyParser = require('body-parser')

const jsonBodyParser = bodyParser.json()

const router = new Router()

router.post('/users', jsonBodyParser, registerUser)

router.post('/users/auth', jsonBodyParser, authenticateUser)

router.get('/users', jwtVerifierMidWare, retrieveUser)

router.post('/users/add-medication', [jwtVerifierMidWare, jsonBodyParser], addMedication)

router.post('/users/delete-medication', [jwtVerifierMidWare, jsonBodyParser], deleteMedication)

router.get('/users/medication', jwtVerifierMidWare, retrievePrescriptedMedication)

router.post('/users/add-prescription', [jwtVerifierMidWare, jsonBodyParser], addPrescription)

router.get('/users/prescription', jwtVerifierMidWare, retrievePrescription)

router.delete('/users/prescription/:drugId', jwtVerifierMidWare, deletePrescription)

router.post('/users/add-progress', [jwtVerifierMidWare, jsonBodyParser], addProgress)

router.get('/users/retrieve-progress', jwtVerifierMidWare, retrieveProgress)

router.get('/drug/:drugName', retrieveDrug)

router.get('/users/contacts', jwtVerifierMidWare, retrieveContacts)

router.post('/users/add-contact', [jwtVerifierMidWare, jsonBodyParser], addContact)

router.delete('/users/contact/:id', jwtVerifierMidWare, deleteContact)

module.exports = router