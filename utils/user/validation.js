const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.InputErrorMsg = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({status: 'error', error: errors.array() });
    }
}

exports.decodeAccessToken = async function (token) {
    return await jwt.verify(token, process.env.JWT_ACCESS_PRIVATE_KEY)
}
exports.decodeRefreshToken = async function (token) {
    return await jwt.verify(token, process.env.JWT_REFRESH_PRIVATE_KEY)
}