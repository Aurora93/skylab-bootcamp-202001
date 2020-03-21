const { random, floor } = Math

import deleteContact from './delete-contact'

const { mongoose, models: { User, Drug, Guideline } } = require('../data')
const { NotAllowedError, NotFoundError } = require('../errors')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const atob = require('atob')

describe('deleteContact', () => { 

    let name, surname, gender, age, phone, profile, email, password, token, user, user2, name2, surname2, gender2, age2, phone2, profile2, email2, password2, idUser, idUserToAdd
    
    const GENDERS = ['male', 'female','non-binary']
    
    
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/test-pill-o-clock', { useNewUrlParser: true, useUnifiedTopology: true })
        await User.deleteMany()
        await Drug.deleteMany()
        await Guideline.deleteMany()
    })
    
    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        phone = `${random()}`
        age = floor(random() * 100)
        gender = GENDERS[floor(random() * GENDERS.length)]
        profile = 'pharmacist'
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        
        name2 = `name-${random()}`
        surname2 = `surname-${random()}`
        gender2 = `gender-${random()}`
        age2 = random()
        phone2 = `00000-${random()}`
        profile2 = `profile-${random()}`
        email2 = `email--${random()}@mail.com`
        password2 = `password-${random()}`

    })

    describe('when user already exists', () => {

        beforeEach(async () => {
            const _password = await bcrypt.hash(password, 10)
            user = await User.create({name, surname, gender, age, phone, profile, email, password: _password})
               
            idUser = user.id
   
            token = jwt.sign({ sub: idUser }, 'my cat is a demon', { expiresIn: '1d' })
            
            user2 = await User.create({ name: name2, surname: surname2, gender: gender2, age: age2, phone: phone2, profile: profile2, email: email2, password: password2 })

            idUser2 = user2.id

            await User.findByIdAndUpdate(idUser, {$push: {contacts: idUser2}})
            user = await User.findById(idUser)

            await User.findByIdAndUpdate(idUser2, {$push: {contacts: idUser}})
            user2= await User.findById(idUser2)
            
        })

        it('should succes on right data', async () =>{

            expect(user.contacts[0].toString()).toMatch(idUser2)
            expect(user2.contacts[0].toString()).toMatch(idUser)

            await deleteContact(token, idUser2)

            user = await User.findById(idUser)
            user2 = await User.findById(idUser2)

            expect(user.contacts.length).toBe(0)
            expect(user2.contacts.length).toBe(0)
        })
    })
     describe('unhappy paths syncronous errors', () => {
        it('should fail on a non-string token', async () => {
            let _error
            __token = 45438
            try {
                await deleteContact(__token, idUser2)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`token ${__token} is not a string`)
            
            __token = false
            try {
                await deleteContact(__token, idUser2)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`token ${__token} is not a string`)
        
            __token = []
            try {
                await deleteContact(__token, idUser2)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`token ${__token} is not a string`)
        })
        it('should fail on a non-string idDrug', async () => {
            let _error
            _idUser = 45438
            try {
                await deleteContact(token, _idUser)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`id ${_idUser} is not a string`)
            
            _idUser = false
            try {
                await deleteContact(token, _idUser)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`id ${_idUser} is not a string`)
        
            _idUser = []
            try {
                await deleteContact(token, _idUser)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`id ${_idUser} is not a string`)
        })
    })
    afterAll(() => User.deleteMany().then(() => mongoose.disconnect()))


})