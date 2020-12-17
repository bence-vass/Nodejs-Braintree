const SerailzerMain = require('../../../utils/serializer')
const Serializer = require('../../../utils/serializer/serializer')
const Deserializer = require('../../../utils/serializer/deserializer')
const {ProductAttribute} = require('../../../models/Product')


describe('Serializer Test', ()=> {
    describe('Main class', ()=>{
        const dbModel = ProductAttribute
        const req = {}
        const res = {}
        const next = {}
        test('Main class create', ()=>{
            let serializer = new SerailzerMain(dbModel, req, res, next)
            expect(serializer.model).toBe(dbModel)
            expect(serializer.req).toBe(req)
            expect(serializer.res).toBe(res)
            expect(serializer.next).toBe(next)
        })
        test('Main class init fn', async (done)=>{
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
    describe('Serializer subclass', ()=>{
        test('Create', async (done)=>{
            let req = {
                body: {
                    "display": "apple"
                }
            }
            let res = {}
            let next = {}
            let serializer = new Serializer(ProductAttribute, req, res, next)
            await serializer.create()
            console.log(res)
            console.log(req)
            expect(true).toBe(true)
            done()
        })
    })
})