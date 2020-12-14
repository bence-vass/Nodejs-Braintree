const ModelView = require('../../utils/crudl/index')
const {ProductAttribute} = require('../../models/Product')

describe('CRUDL Class test', () => {

    describe('create with functionsIncluded and functionsExcluded', () => {
        const VALID_OPTIONS = ["CREATE", "READ", "UPDATE", "DELETE", "LIST"]
        test('WITH functionsIncluded AND functionsExcluded', () => {
            expect(() => {
                let view = new ModelView(
                    ProductAttribute,
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
                let view = new ModelView(
                    ProductAttribute,
                    'urlString',
                    {
                        functionsIncluded: null,
                        functionsExcluded: null
                    }
                )
            }).toThrow()
        })
        test('WITHOUT functionsIncluded AND functionsExcluded', () => {
            let view = new ModelView(
                ProductAttribute,
                'urlString',
            )
            expect(view.enabledFunction.sort()).toEqual(VALID_OPTIONS.sort())

        })
        test('WITH functionsIncluded', () => {
            let includedFns= ['LIST', 'CREATE']
            let view = new ModelView(
                ProductAttribute,
                'urlString',
                {
                    functionsIncluded: includedFns
                }
            )
            expect(view.enabledFunction.sort()).toEqual(includedFns.sort())
        })
        test('WITH invalid functionsIncluded', () => {
            expect(() => {
                let view = new ModelView(
                    ProductAttribute,
                    'urlString',
                    {
                        functionsIncluded: ['LIST', 'APPLE']
                    }
                )
            }).toThrow('Invalid include functions')
        })
        test('WITH functionsExcluded', () => {
            let includedFns= ['LIST', 'CREATE']
            let view = new ModelView(
                ProductAttribute,
                'urlString',
                {
                    functionsExcluded: ['LIST', 'CREATE']
                }
            )
            expect(view.enabledFunction.sort()).toEqual(includedFns.sort())

        })
        test('WITH invalid functionsExcluded', () => {
            expect(() => {
                let view = new ModelView(
                    ProductAttribute,
                    'urlString',
                    {
                        functionsExcluded: ['LIST', 'APPLE']
                    }
                )
            }).toThrow('Invalid exclude functions')
        })
    })

    describe('Test: setEnabledFunctions', ()=>{

    })

})