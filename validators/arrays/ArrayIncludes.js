/***
 * Check if the givenOptions Array elements are included in the validOptions array
 * if every givenOptions are included return true otherwise false
 * @param {Array} givenOption
 * @param {Array} validOption
 * @return {boolean}
 */
module.exports.ArrayElementsElementsOfArray = (givenOption, validOption) => {
    return givenOption.every(item=>{
        return validOption.includes(item)
    })
}