const SerailzerMain = require('../../../utils/serializer')
const Serializer = require('../../../utils/serializer/serializer')
const Deserializer = require('../../../utils/serializer/deserializer')
const {ProductAttribute} = require('../../../models/Product')

const request = require('supertest')

const mongoose = require('../../../mongooseConnect')
let cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express')
let app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser());


describe('Serializer Test', () => {
    describe('Main class', () => {
        const dbModel = ProductAttribute
        const req = {}
        const res = {}
        const next = {}
        test('Main class create', () => {
            let serializer = new SerailzerMain(dbModel, req, res, next)
            expect(serializer.model).toBe(dbModel)
            expect(serializer.req).toBe(req)
            expect(serializer.res).toBe(res)
            expect(serializer.next).toBe(next)
        })
        test('Main class init fn', async (done) => {
            let req2 = {count: 1}
            let serializer = new SerailzerMain(dbModel)
            await serializer.init(req2, res)
            expect(serializer.model).toBe(dbModel)
            expect(serializer.req).toEqual(req2)
            expect(serializer.res).toEqual(res)
            expect(serializer.next).toEqual(null)
            done()
        })
    })
    describe('Integration Tests', () => {
        beforeAll(() => {
            mongoose.connection.dropCollection(ProductAttribute.collection.collectionName)
        })
        afterAll(() => {
            mongoose.connection.close()
        })

        app.post('/test/create', async (req, res, next) => {
            let serializer = new Serializer(ProductAttribute)
            await serializer.init(req, res, next)
            await serializer.create()
        })
        app.post('/test/delete/:documentId', async (req, res, next) => {
            const docId = req.params.documentId || null
            let serializer = new Serializer(ProductAttribute)
            await serializer.init(req, res, next)
            await serializer.delete(docId)
        })
        app.post('/test/update/:documentId', async (req, res, next) => {
            const docId = req.params.documentId || null
            const newData = req.body || null
            let serializer = new Serializer(ProductAttribute)
            await serializer.init(req, res, next)
            await serializer.updateByID(docId, newData)
        })
        app.post('/test/list', async (req, res, next) => {
            let deserializer = new Deserializer(ProductAttribute)
            await deserializer.init(req, res, next)
            await deserializer.listCollection()
        })
        app.post('/test/:documentId', async (req, res, next) => {
            const docId = req.params.documentId || null
            let deserializer = new Deserializer(ProductAttribute)
            await deserializer.init(req, res, next)
            await deserializer.findByID(docId)
        })

        describe('Serializer', () => {
            test('Create', done => {
                request(app)
                    .post('/test/create')
                    .send({
                        display: "test create"
                    })
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(res.body.display).toBe('test create')
                        console.log(res.body)
                        done()
                    })
            })
            test('Delete', done => {
                request(app).post('/test/create')
                    .send({
                        display: 'test delete'
                    })
                    .end((err, res) => {
                        if (err) return done(err)
                        request(app).post('/test/delete/' + res.body._id)
                            .end((err, res) => {
                                if (err) return done(err)
                                //console.log(res.body)
                                done()
                            })

                    })
            })
            test('Update', done => {
                request(app).post('/test/create/')
                    .send({
                        display: "test update"
                    })
                    .end((err, res) => {
                        if (err) return done(err)
                        request(app).post('/test/update/' + res.body._id)
                            .send({
                                display: "test update v2"
                            })
                            .end((err, res) => {
                                if (err) return done(err)
                                expect(res.body.display).toBe('test update v2')
                                done()
                            })
                    })
            })
        })
        describe('Deserializer', () => {
            test('Find by id', done => {
                request(app).post('/test/create')
                    .send({
                        display: 'test find by id'
                    })
                    .end((err, res) => {
                        if (err) return done(err)
                        request(app).post('/test/' + res.body._id)
                            .end((err, res) => {
                                if (err) return done(err)
                                expect(res.body.display).toBe('test find by id')
                                done()
                            })
                    })
            })
            test('List collection', async done => {
                // IMPORTANT not to be interrupted by other tests, it compares the whole response with the created ones
                await mongoose.connection.dropCollection(ProductAttribute.collection.collectionName)

                let collectionLength = 10
                let createdDocs = []
                for (let i = 0; i < collectionLength; i++) {
                     await new Promise((resolve, reject) => {
                        request(app).post('/test/create')
                            .send({
                                display: 'test ' + i
                            })
                            .end((err, res) => {
                                if (err) reject('Creation error')
                                createdDocs.push(res.body)
                                resolve(res.body)
                            })
                    })
                }
                request(app).post('/test/list')
                    .end((err, res) => {
                        if (err) return done(err)
                        console.log('list res: ')
                        console.log(res.body)
                        console.log('expected: ')
                        console.log(createdDocs)
                        expect(res.body).toEqual(createdDocs)
                        done()
                    })
            })
        })
    })

})

module.exports = app