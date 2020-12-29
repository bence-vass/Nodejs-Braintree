const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.InputErrorMsg = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw errors.array()
    }
}

exports.decodeAccessToken = async function (token) {
    return await jwt.verify(token, process.env.privateKey)
}
exports.decodeRefreshToken = async function (token) {
    return await jwt.verify(token, process.env.privateKey)
}