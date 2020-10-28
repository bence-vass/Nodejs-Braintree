const supertest = require('supertest');
const mongoose = require('mongoose')
const app = require('../../app')
const request = supertest(app)

let testDocId

describe('Model: Category', () => {
    beforeAll(done => {
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