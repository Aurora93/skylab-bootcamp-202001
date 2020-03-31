require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { mongoose, models: { User, Drug, Guideline } } = require('pill-o-clock-data')
const { expect } = require('chai')
const { floor, random } = Math
const addPrescription = require('./add-prescription')
const { ContentError, NotAllowedError } = require('pill-o-clock-errors')

describe('addPrescription', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Promise.all([User.deleteMany(), Drug.deleteMany()]))
    )

    let name, surname, gender, age, phone, profile, email, password, drugName, description, _id, __id, time

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        gender = `gender-${random()}`
        age = random()
        phone = `00000-${random()}`
        profile = `profile-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        drugName = `drugName-${random()}`
        description = `description-${random()}`
        time = [`${floor(random() * 23)}${floor(random() * 59)}`]

    })

    describe('when user already exists', () => {

        beforeEach(() => 
            User.create({ name, surname, gender, age, phone, profile, email, password })
                .then(({ id }) => {
                    _id = id
                })
            .then(() => Drug.create({drugName, description}))
            .then(({id}) => _drugId = id)
        )

        it('should succeed on correct and valid and right data', () =>
            addPrescription(_id, _drugId, time)
                .then(() => User.findById(_id).lean() )
                .then((user) => {
                    expect(user).to.exist 
                    
                    expect(user.prescription[0]).to.exist
                    expect(user.prescription[0].times[0]).to.equal(time[0])
                })
        )
        
        it('should fail to add the prescription if it has already been added before', () => {
            addPrescription(_id, _drugId, time)
            .catch(error => {
                expect(error).to.exist
                expect(error).to.be.instanceof(NotAllowedError)
                expect(error.message).to.equal(`user with id ${_id} already have drug with id ${_drugId} in his prescription`)
            })
        })

        it('should fail if the user does not exist', () => {
            User.deleteMany()
            .then(() => addPrescription(_id, _drugId, time))
                .catch(({message })=> {
                    expect(message).to.exist
                    
                    expect(message).to.equal(`user with id ${_id} not found`)
                })
        })

        it('should fail if the drug does not exist', () => {
            Drug.deleteMany()
            .then(() => addPrescription(_id, _drugId, time))
                .catch(({message })=> {
                    expect(message).to.exist
                    
                    expect(message).to.equal(`drug with id ${_drugId} not found`)
                })
        })

    })

    describe('unhappy path syncronous', () => {
        beforeEach(() => 
            User.create({ name, surname, gender, age, phone, profile, email, password })
        .then(({id}) => {
            __id = id
        })
        )

        it('should fail on a non string id', () => {
            _id = 9328743289
            expect(() => addPrescription(_id, drugName, time)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = []
            expect(() => addPrescription(_id, drugName, time)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = false
            expect(() => addPrescription(_id, drugName, time)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = undefined
            expect(() => addPrescription(_id, drugName, time)).to.throw(TypeError, `id ${_id} is not a string`)
        })

        it('should fail on a non string drugName', () => {
            _id = 'some id'
            drugName = 9328743289
            expect(() => addPrescription(_id, drugName, time)).to.throw(TypeError, `drugId ${drugName} is not a string`)

            drugName = []
            expect(() => addPrescription(_id, drugName, time)).to.throw(TypeError, `drugId ${drugName} is not a string`)

            drugName = false
            expect(() => addPrescription(_id, drugName, time)).to.throw(TypeError, `drugId ${drugName} is not a string`)

            drugName = undefined
            expect(() => addPrescription(_id, drugName, time)).to.throw(TypeError, `drugId ${drugName} is not a string`)
        })

        it('should fail on a non-array times', () => {
            drugName = 'some drugId'
            time = 9328743289
            expect(() => addPrescription(_id, drugName, time)).to.throw(TypeError, `times ${time} is not a Array`)

            time = 'ddhbsdkjfdsk'
            expect(() => addPrescription(_id, drugName, time)).to.throw(TypeError, `times ${time} is not a Array`)

            time = false
            expect(() => addPrescription(_id, drugName, time)).to.throw(TypeError, `times ${time} is not a Array`)

            time = undefined
            expect(() => addPrescription(_id, drugName, time)).to.throw(TypeError, `times ${time} is not a Array`)
        })

        it('should fail on a non-stringOfNumbers value for times', () => {
            
            time = [[]]
            expect(() => addPrescription(_id, drugName, time)).to.throw(ContentError, `${time[0]} is not a valid time`)

            time = ['ddhbsdkjfdsk']
            expect(() => addPrescription(_id, drugName, time)).to.throw(ContentError, `${time[0]} is not a valid time`)

            time = [false]
            expect(() => addPrescription(_id, drugName, time)).to.throw(ContentError, `${time[0]} is not a valid time`)

            time = [undefined]
            expect(() => addPrescription(_id, drugName, time)).to.throw(ContentError, `${time[0]} is not a valid time`)
        })
    })

after(() => Promise.all([User.deleteMany(), Drug.deleteMany(), Guideline.deleteMany()]).then(() => mongoose.disconnect()))
})
