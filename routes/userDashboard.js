var express = require('express');
var router = express.Router();
const userController = require('../controllers/users')
const bodyInputValidator = require('../validators/user/bodyInputValidator')
const authMiddleware = require('../middleware/authentication/AuthenticationJWT')
const {User} = require("../models/User");
const {decodeAccessToken} = require("../utils/user/validation");

router.get('/login', (req, res) => {
    res.render('user/login')
})
router.get('/signup', (req, res) => {
    res.render('user/register')
})
router.get(
    '/profile',
    [(req,res,next) => authMiddleware.isAuthenticated(req,res,next, req.cookies.accessToken), ],
    async (req, res) => {
        try{
            const token = req.cookies.accessToken
            let decoded = await decodeAccessToken(token)
            let user = await User.findById(decoded.sub)
            res.render('user/profile', {
                user: user,
            })
        } catch (error) {
            res.status(400).json({status: 'error', error: error})
        }

    })

module.exports = router;
