const {ArrayElementsElementsOfArray} = require('../../../validators/arrays/ArrayIncludes')



describe('Validators --- Array --- ArrayIncludes', () => {

    describe('Test fn: ArrayElementsElementsOfArray', ()=>{

        const VALID_OPTIONS = ["CREATE", "READ", "UPDATE", "DELETE", "LIST"]

        test('Elements are contained by the array', ()=>{
            const validGivenOptions = ["CREATE", "READ"]
            expect(ArrayElementsElementsOfArray(validGivenOptions, VALID_OPTIONS)).toBe(true)
        })
        test('Elements are contained by the array', ()=>{
            const invalidGivenOptions = ["CREATE", "APPLE"]
            expect(ArrayElementsElementsOfArray(invalidGivenOptions, VALID_OPTIONS)).toBe(false)
        })

    })


})