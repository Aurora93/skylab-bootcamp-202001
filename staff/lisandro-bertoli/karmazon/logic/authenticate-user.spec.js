describe('authenticateUser', () => {

    let name, surname, username, password;

    beforeEach(() => {
        name = 'name-' + Math.random()
        surname = 'surname-' + Math.random()
        username = 'username-' + Math.random()
        password = 'password-' + Math.random()

    });

    describe('when user already exists', () => {

        beforeEach(done =>
            call(`https://skylabcoders.herokuapp.com/api/v2/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, surname, username, password })
            }, response => {
                if (response instanceof Error) return done(response)

                if (response.content) {
                    const { error } = JSON.parse(response.content)

                    if (error) return done(new Error(error))
                }

                done()
            })

        )

        it('should succeed on correct credentials', done => {

            authenticateUser(username, password, token => {
                expect(token).toBeA('string')

                const [header, payload, signature] = token.split('.')
                expect(header.length).toBeGreaterThan(0)
                expect(payload.length).toBeGreaterThan(0)
                expect(signature.length).toBeGreaterThan(0)

                done()
            })

        })

        it('should fail on incorrect password', done => {
            authenticateUser(username, `${password}-wrong`, error => {

                expect(error).toBeInstanceOf(Error)
                expect(error.message).toBe('username and/or password wrong')

                done()
            })
        })

        it('should fail on incorrect username', (done) => {

            authenticateUser(`${username}-wrong`, password, error => {

                expect(error).toBeInstanceOf(Error)
                expect(error.message).toBe('username and/or password wrong')

                done()
            })
        })

        afterEach(done => {
            call(`https://skylabcoders.herokuapp.com/api/v2/users/auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            }, response => {

                if (response instanceof Error) return done(response)

                const { error, token } = JSON.parse(response.content)

                if (error) return done(new Error(error))

                call(`https://skylabcoders.herokuapp.com/api/v2/users`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ password })
                }, response => {

                    if (response instanceof Error) return done(response)

                    if (response.content) {
                        const { error } = JSON.parse(response.content)

                        if (error) return done(new Error(error))
                    }

                    done()
                })
            })

        })

    })

    it('should fail when user does not exist', done => {
        debugger
        authenticateUser(username, password, error => {
            expect(error).toBeInstanceOf(Error)
            expect(error.message).toBe('username and/or password wrong')

            done()
        })
    })

    it('should fail on non-string username', () => {
        username = 1
        expect(() =>
            authenticateUser(username, password, () => { })
        ).toThrowError(TypeError, `username ${username} is not a string`)

        username = true
        expect(() =>
            authenticateUser(username, password, () => { })
        ).toThrowError(TypeError, `username ${username} is not a string`)

        username = undefined
        expect(() =>
            authenticateUser(username, password, () => { })
        ).toThrowError(TypeError, `username ${username} is not a string`)
    })

    it('should fail on non-string password', () => {
        password = 1
        expect(() =>
            authenticateUser(username, password, () => { })
        ).toThrowError(TypeError, `password ${password} is not a string`)

        password = true
        expect(() =>
            authenticateUser(username, password, () => { })
        ).toThrowError(TypeError, `password ${password} is not a string`)

        password = undefined
        expect(() =>
            authenticateUser(username, password, () => { })
        ).toThrowError(TypeError, `password ${password} is not a string`)
    })

    it('should fail on non-function callback', () => {

        expect(() =>
            authenticateUser(username, password, 1)
        ).toThrowError(TypeError, `callback ${1} is not a function`)

        expect(() =>
            authenticateUser(username, password, true)
        ).toThrowError(TypeError, `callback ${true} is not a function`)

        expect(() =>
            authenticateUser(username, password, undefined)
        ).toThrowError(TypeError, `callback ${undefined} is not a function`)
    })



})
