const CRUDL = require('../../../utils/crudl')
const {ProductAttribute} = require('../../../models/Product')

const request = require('supertest')

const mongoose = require('../../../mongooseConnect')
let cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express')
let app = express()
const router = express.Router()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser());

describe('CRUDL Class test', () => {
    describe('class function tests', () => {
        describe('setEnabledFunctions', () => {
            const setEnabledFn = CRUDL.setEnabledFunctions
            const validIncludes = ["CREATE", "READ"]
            const invalidIncludes = ["CREATE", "APPLE"]
            const validExcludes = ["UPDATE", "DELETE"]
            const invalidExcludes = ["LIST", "ORANGE"]
            test('WITH functionsIncluded AND functionsExcluded', () => {
                expect(() => {
                    setEnabledFn(validIncludes, validExcludes)
                }).toThrow('Include and exclude can not be parameters at the sametime')
            })
            test('WITH functionsIncluded AND functionsExcluded are both set to null', () => {
                expect(() => {
                    setEnabledFn(null, null)
                }).toThrow('Give at least one valid parameter')
            })
            test('WITH functionsIncluded', () => {
                expect(setEnabledFn(validIncludes, null)).toBe(validIncludes)
            })
            test('WITH invalid functionsIncluded', () => {
                expect(() => {
                    setEnabledFn(invalidIncludes, null)
                }).toThrow('Invalid include functions')
            })
            test('WITH functionsExcluded', () => {
                expect(setEnabledFn(null, validExcludes)).toBe(validExcludes)
            })
            test('WITH invalid functionsExcluded', () => {
                expect(() => {
                    setEnabledFn(null, invalidExcludes)
                }).toThrow('Invalid exclude functions')
            })


        })

    })
    describe('Create with functionsIncluded and functionsExcluded', () => {
        const VALID_OPTIONS = ["CREATE", "READ", "UPDATE", "DELETE", "LIST"]
        test('WITH functionsIncluded AND functionsExcluded', () => {
            expect(() => {
                let view = new CRUDL(
                    ProductAttribute,
                    null,
                    'urlString',
                    {
                        functionsIncluded: ['LIST', 'CREATE'],
                        functionsExcluded: ['LIST', 'CREATE']
                    }
                )
            }).toThrow()
        })
        test('WITH functionsIncluded AND functionsExcluded are both set to null', () => {
            expect(() => {
                let view = new CRUDL(
                    ProductAttribute,
                    null,
                    'urlString',
                    {
                        functionsIncluded: null,
                        functionsExcluded: null
                    }
                )
            }).toThrow()
        })
        test('WITHOUT functionsIncluded AND functionsExcluded', () => {
            let view = new CRUDL(
                ProductAttribute,
                null,
                'urlString',
            )
            expect(view.enabledFunction.sort()).toEqual(VALID_OPTIONS.sort())

        })

    })
    describe('Views Integration tests', () => {
        beforeAll(() => {
            try {
                mongoose.connection.dropCollection(ProductAttribute.collection.collectionName)
                console.log('collection dropped')
            } catch (e) {
                console.log('could not drop collection')
                //console.error(e)
            }
        })
        afterAll(() => {
            mongoose.connection.close()
        })

        let AttributeView = new CRUDL(ProductAttribute, app, '/test-attr')
        AttributeView.listView()
        AttributeView.createView()
        AttributeView.updateView()
        AttributeView.deleteView()
        AttributeView.readView()
        describe('List View', () => {
            test('Basic listing', async done => {
                // IMPORTANT not to be interrupted by other tests, it compares the whole response with the created ones
                try {
                    await mongoose.connection.dropCollection(ProductAttribute.collection.collectionName)
                    console.log('collection dropped')
                } catch (e) {
                    console.log('could not drop collection')
                    //console.error(e)
                }

                let collectionLength = 10
                let createdDocs = []
                for (let i = 0; i < collectionLength; i++) {
                    await new Promise((resolve, reject) => {
                        request(app)
                            .post('/test-attr/create')
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
                request(app)
                    .post('/test-attr/list')
                    .end((err, res) => {
                        if (err) return done(err)
                        console.log(res.body)
                        expect(res.body).toEqual(createdDocs)
                        done()
                    })
            })
        })
        describe('Create View', () => {
            test('Basic doc creation', done => {
                request(app).post('/test-attr/create')
                    .send({
                        display: "test create view"
                    })
                    .end((err, res) => {
                        if (err) return done(err)
                        console.log(res.body)
                        expect(res.body.display).toBe("test create view")
                        done()
                    })
            })
        })
        describe('Update View', () => {
            test('Basic update', done => {
                request(app)
                    .post('/test-attr/create')
                    .send({
                        display: "test update view"
                    })
                    .end((err, res) => {
                        if (err) return done(err)
                        console.log(res.body)
                        request(app)
                            .post('/test-attr/' + res.body._id + '/update')
                            .send({
                                display: "test update view v2"
                            })
                            .end((err, res) => {
                                if (err) return done(err)
                                console.log(res.body)
                                expect(res.body.display).toBe("test update view v2")
                                done()
                            })
                    })

            })
        })
        describe('Delete View', () => {
            test('Basic delete', done => {
                request(app)
                    .post('/test-attr/create')
                    .send({
                        display: "test delete view"
                    })
                    .end((err, res) => {
                        if (err) return done(err)
                        console.log(res.body)
                        request(app)
                            .post('/test-attr/' + res.body._id + '/delete')
                            .end((err, res) => {
                                if (err) return done(err)
                                console.log(res.body)
                                //expect(res.body.display).toBe("test update view v2")
                                done()
                            })
                    })

            })
        })
        describe('Read View', () => {
            test('Basic Read', done => {
                request(app)
                    .post('/test-attr/create')
                    .send({
                        display: "test read view"
                    })
                    .end((err, res) => {
                        if (err) return done(err)
                        console.log(res.body)
                        request(app)
                            .post('/test-attr/' + res.body._id)
                            .end((err, res) => {
                                if (err) return done(err)
                                console.log(res.body)
                                expect(res.body.display).toBe("test read view")
                                done()
                            })
                    })

            })
        })
    })

})