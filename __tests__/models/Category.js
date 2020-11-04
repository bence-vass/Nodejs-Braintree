const supertest = require('supertest');
const mongoose = require('mongoose')
const app = require('../../app')
const request = supertest(app)
require('dotenv').config({path: '.env.development'})
const uri =
    'mongodb+srv://' +
    process.env.MONGO_ATLAS_USER +
    ':' +
    process.env.MONGO_ATLAS_PW +
    '@cluster0.mboj5.mongodb.net/' +
    //process.env.MONGO_ATLAS_CLUSTER +
    'test001' +
    '?retryWrites=true&w=majority'

let testDocId

describe('API Test -- Model: Category', () => {
    beforeAll(async done => {
        await mongoose.connection.close()
        await mongoose.connect(uri ,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        )
        done()
    })
    afterAll(done => {
        mongoose.connection.close()
        done()
    })
    test('Create new category', async done => {
        const req = await request.post('/categories/add')
            .set('Content-Type', 'application/json')
            .send({
                name: 'NewCategory'
            })
        testDocId = req.body.category._id
        expect(req.body.category.name).toBe('NewCategory')
        done()
    })
    test('Listing', async done => {
        const res = await request.get('/categories/list')
        expect(res.status).toBe(201)
        done()
    })
    test('Delete category by id', async done => {
        const req = await request.post('/categories/remove')
            .set('Content-Type', 'application/json')
            .send({
                id: testDocId
            })
        expect(req.status).toBe(201)
        done()
    })
})