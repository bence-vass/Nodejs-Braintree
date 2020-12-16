const {ArrayElementsElementsOfArray: checkArrayOfFn} = require('../../validators/arrays/ArrayIncludes')

const REQUEST_FUNCTIONS = ["CREATE", "READ", "UPDATE", "DELETE", "LIST"]

class ModelView {
    constructor(dbModel, urlString, options = {functionsIncluded: REQUEST_FUNCTIONS, functionsExcluded: null}) {
        this.dbModel = dbModel
        this.urlString = urlString
        this.enabledFunction = ModelView.setEnabledFunctions(options.functionsIncluded, options.functionsExcluded)
    }
    static allAvailableFunction = REQUEST_FUNCTIONS
    static setEnabledFunctions = (included, excluded) => {
        if (included === null && excluded === null) {
            throw new Error('Give at least one valid parameter')
        }
        if (included && excluded) {
            throw new Error('Include and exclude can not be parameters at the sametime')
        }
        if (excluded) {
            if (checkArrayOfFn(excluded, ModelView.allAvailableFunction)) {
                return excluded
            } else {
                throw new Error('Invalid exclude functions')
            }
        }
        if (included) {
            if (checkArrayOfFn(included, ModelView.allAvailableFunction)) {
                return included
            } else {
                throw new Error('Invalid include functions')
            }
        }


    }


}

module.exports = ModelView