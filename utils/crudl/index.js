const {ArrayElementsElementsOfArray: checkArrayOfFn} = require('../../validators/arrays/ArrayIncludes')

const REQUEST_FUNCTIONS = ["CREATE", "READ", "UPDATE", "DELETE", "LIST"]

class ModelView {

 constructor(dbModel, urlString, options={functionsIncluded: REQUEST_FUNCTIONS, functionsExcluded: null}) {
     this.dbModel = dbModel
     this.urlString = urlString
     this.enabledFunction = this.setEnabledFunctions(options.functionsIncluded, options.functionsExcluded)
 }

 setEnabledFunctions = (included, excluded) => {
     if(included === null && excluded === null){
         throw new Error('Give at least one valid request function')
     }
     if(included && excluded){
         throw new Error('Invalid parameters')
     }
     if(excluded){
         if(checkArrayOfFn(excluded, REQUEST_FUNCTIONS)){
             return excluded
         } else {
             throw new Error('Invalid exclude functions')
         }
     }
     if(included){
        if(checkArrayOfFn(included, REQUEST_FUNCTIONS)){
            return included
        } else {
            throw new Error('Invalid include functions')
        }
     }


 }


}

module.exports = ModelView