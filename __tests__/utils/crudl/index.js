const CRUDL = require('../../../utils/crudl')
const {ProductAttribute} = require('../../../models/Product')


describe('CRUDL Class test', () => {

    describe('Test: setEnabledFunctions', () => {
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
            expect(()=>{
                setEnabledFn(null, invalidExcludes)
            }).toThrow('Invalid exclude functions')
        })


    })
    describe('create with functionsIncluded and functionsExcluded', () => {
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


})