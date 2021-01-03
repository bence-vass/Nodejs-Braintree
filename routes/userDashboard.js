var express = require('express');
var router = express.Router();
const userController = require('../controllers/users')
const bodyInputValidator = require('../validators/user/bodyInputValidator')
const authMiddleware = require('../middleware/authentication/AuthenticationJWT')
const {User} = require("../models/User");
const {decodeAccessToken} = require("../utils/user/validation");

router.get(
    '/login',
    [
        (req, res, next) => authMiddleware.isAnonymous(req, res, next, req.cookies.accessToken),
    ],
    (req, res) => {
        res.render('user/login')
    }
)
router.get(
    '/signup',
    [
        (req, res, next) => authMiddleware.isAnonymous(req, res, next, req.cookies.accessToken),

    ],
    (req, res) => {
        res.render('user/register')
    }
)
router.get(
    '/profile',
    [
        (req, res, next) => authMiddleware.isAuthenticated(req, res, next, req.cookies.accessToken),
    ],
    async (req, res) => {
        try {
            const token = req.cookies.accessToken
            let decoded = await decodeAccessToken(token)
            let user = await User.findById(decoded.sub)
            res.render('static-dashboard/page/profile', {
                user: user,
            })
        } catch (error) {
            res.status(400).json({status: 'error', error: error})
        }
    }
)
router.get(
    '/logout',
    //[],
    (req, res, next) => {
        res.clearCookie("accessToken", {path: '/users/dashboard'})
        res.clearCookie("refreshToken", {path: '/users/dashboard'})
        res.redirect('login')
    }
)

router.get(
    '/users',
    [
        (req, res, next) => authMiddleware.isAdmin(req, res, next, req.cookies.accessToken),
    ],
    async (req, res) => {
        try {
            let users = await User.find({})
            res.render('static-dashboard/page/user-list', {
                users: users,
            })
        } catch (error) {
            res.status(400).json({status: 'error', error: error})
        }
    }
)
module.exports = router;
