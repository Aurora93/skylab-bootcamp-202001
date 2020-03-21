require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { mongoose, models: { User } } = require('pill-o-clock-data')
const { expect } = require('chai')
const { random } = Math
const deleteContact = require('./delete-contact')

describe('deleteContact', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.deleteMany())
    )

    let name, surname, gender, age, phone, profile, email, password, name2, surname2, gender2, age2, phone2, profile2, email2, password2, idUser, idUserToAdd

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        gender = `gender-${random()}`
        age = random()
        phone = `00000-${random()}`
        profile = `profile-${random()}`
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

        beforeEach(() => 
            Promise.all([User.create({ name, surname, gender, age, phone, profile, email, password }),
                User.create({ name: name2, surname: surname2, gender: gender2, age: age2, phone: phone2, profile: profile2, email: email2, password: password2 })])
                
                .then(([user, user2]) => {
                    idUser = user.id
                    idUser2 = user2.id

                    return Promise.all([User.findByIdAndUpdate(idUser, {$push: {contacts: idUser2}}), User.findByIdAndUpdate(idUser2, {$push: {contacts: idUser}})])
                })
                .then(()=>{})
        )
        it('should fail if the user does not exist', () => {
            idUser = `${idUser}-wrong`
            deleteContact(idUser, idUser2)
                .then(()=> {throw new Error ('should not reach this point')})
                .catch(({message })=> {
                    expect(message).to.exist
                    
                    expect(message).to.equal(`user with id ${idUser} not found`)
                    
                })
        })

        it('should fail if the second user does not exist', () => {
            idUser2 = `${idUser2}-wrong`
            deleteContact(idUser, idUser2)
                .then(()=> {throw new Error ('should not reach this point')})
                .catch(({message })=> {
                    expect(message).to.exist
                    
                    expect(message).to.equal(`user with id ${idUser2} not found`)
                    
                })
        })

        it('should succeed on correct and valid and right data', () =>
            User.findById(idUser).lean()
                .then((user) => {
                    expect(user.contacts).to.exist
                    expect(user.contacts[0]).to.exist
                    expect(user.contacts[0].toString()).to.equal(idUser2.toString())
                })

            .then( () => deleteContact(idUser, idUser2)
                .then(() => User.findById(idUser).lean() )
                .then((user) => {
                    expect(user).to.exist
                    expect(user.contacts[0]).to.be.undefined
                })
            )
        )
    })

    describe('unhappy path syncronous', () => {
        
        it('should fail on a non-string idUser', () => {
            let idWrong
            idWrong = 9328743289
            expect(() => deleteContact(idWrong, idUser2)).to.throw(TypeError, `id ${idWrong} is not a string`)
            idWrong = false
            expect(() => deleteContact(idWrong, idUser2)).to.throw(TypeError, `id ${idWrong} is not a string`)
            idWrong = undefined
            expect(() => deleteContact(idWrong, idUser2)).to.throw(TypeError, `id ${idWrong} is not a string`)
            idWrong = []
            expect(() => deleteContact(idWrong, idUser2)).to.throw(TypeError, `id ${idWrong} is not a string`)

        })

        it('should fail on a non-string idUserToAdd', () => {
            let idWrong
            idWrong = 9328743289
            expect(() => deleteContact(idUser, idWrong)).to.throw(TypeError, `idUserDelete ${idWrong} is not a string`)
            idWrong = false
            expect(() => deleteContact(idUser, idWrong)).to.throw(TypeError, `idUserDelete ${idWrong} is not a string`)
            idWrong = undefined
            expect(() => deleteContact(idUser, idWrong)).to.throw(TypeError, `idUserDelete ${idWrong} is not a string`)
            idWrong = []
            expect(() => deleteContact(idUser, idWrong)).to.throw(TypeError, `idUserDelete ${idWrong} is not a string`)

        })


    })
        


    after(() => Promise.all([User.deleteMany()]).then(() => mongoose.disconnect()))
})