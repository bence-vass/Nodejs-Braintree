const UserAuth = require('../../../utils/authentication/index')
const mongoose = require('../../../mongooseConnect')
const {User} = require('../../../models/User')


describe('Authentication Test', () => {
    describe('Class Functions', () => {
        beforeEach(async () => {
            try {
                await mongoose.connection.dropCollection(User.collection.collectionName)
                console.log('collection dropped')
            } catch (e) {
                console.log('could not drop collection')
                console.error(e)
            }
        })
        afterAll(() => {
            mongoose.connection.close()
        })
        describe('Hashing', () => {
            test('Hash password', () => {
                let password = 'password123'
                let passwordHash = UserAuth.hashPassword(password)
                console.log(passwordHash)
                console.log(passwordHash.length)
                expect(passwordHash.length).toBeGreaterThan(53)
            })
            test('Compare password', () => {
                let password = 'superpassword'
                let passwordHash = UserAuth.hashPassword(password)
                let verify = UserAuth.verifyPassword(password, passwordHash)
                console.log(verify)
                expect(verify).toBe(true)
            })
            test('Compare Invalid password', () => {
                let validPass = 'megapassword'
                let invalidPass = 'finepassword'
                let passwordHash = UserAuth.hashPassword(validPass)
                let verify = UserAuth.verifyPassword(invalidPass, passwordHash)
                console.log(verify)
                expect(verify).toBe(false)
            })
        })
        describe('Create user fn', () => {

            test('w/ Valid credentials', async done => {
                let email = 'create@test.com'
                let password = 'password123'
                let auth = new UserAuth()
                let user = await auth.createUser(email, password)
                console.log(user)
                expect(user.email).toBe(email)
                done()
            })
        })
        describe('Login user fn', () => {
            test('w/ Valid password', async done => {
                let email = 'user1@asd.asd'
                let password = 'passw123'
                let auth = new UserAuth()
                await auth.createUser(email, password)
                let user = await auth.loginUser(email, password)
                console.log(user)
                expect(user.email).toEqual(email)
                done()
            })
            test('w/ Invalid password', async () => {
                await expect(async ()=>{
                    let email = 'user1@asd.asd'
                    let password = 'passw123'
                    let invalidPassword = 'invalid pass'
                    let auth = new UserAuth()
                    await auth.createUser(email, password)
                    let user = await auth.loginUser(email, invalidPassword)
                    console.log(user)
                    return user
                }).rejects.toThrow('Invalid credentials');

            })
            test('w/ Invalid email', async () => {
                await expect(async ()=>{
                    let email = 'invalid@asd.asd'
                    let password = 'passw123'
                    let auth = new UserAuth()
                    let user = await auth.loginUser(email, password)
                    console.log(user)
                    return user
                }).rejects.toThrow('Invalid Email address');

            })
        })
    })
})