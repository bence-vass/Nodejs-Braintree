const JwtAuth = require('../../../utils/authentication/jwtAuthentication')
const mongoose = require('../../../mongooseConnect')
const {User, RefreshToken} = require('../../../models/User')


describe('Authentication tests', () => {
    beforeEach(async () => {
        try {
            await mongoose.connection.dropCollection(User.collection.collectionName)
            console.log('user collection dropped')
        } catch (e) {
            console.log('user could not drop collection')
        }
        try {
            await mongoose.connection.dropCollection(RefreshToken.collection.collectionName)
            console.log('refresh token collection dropped')
        } catch (e) {
            console.log('refresh token could not drop collection')
        }
    })
    afterAll(() => {
        mongoose.connection.close()
    })
    describe('Login', () => {
        test('Valid login', async done => {
            let email = 'valid@login.com'
            let password = 'password123'
            let jwtAuth = new JwtAuth()
            await jwtAuth.createUser(email, password)
            let response = await jwtAuth.login(email, password)
            console.log(response)
            expect(typeof response).toEqual('object')
            done()
        })
    })
    describe('Refresh', () => {
        test('Valid token', async done => {
            let email = 'valid@refresh.com'
            let password = 'password123'
            let jwtAuth = new JwtAuth()
            await jwtAuth.createUser(email, password)
            let response = await jwtAuth.login(email, password)
            console.log(response)
            await new Promise(r => setTimeout(r, 1000))
            let newResponse = await jwtAuth.refresh(response.refreshToken)
            console.log(newResponse)
            expect(newResponse.refreshToken).not.toEqual(response.refreshToken)
            done()
        })
    })
})