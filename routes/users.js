var express = require('express');
var router = express.Router();
let userDashboard = require('./userDashboard')
const userController = require('../controllers/users')
const bodyInputValidator = require('../validators/user/bodyInputValidator')
const authMiddleware = require('../middleware/authentication/AuthenticationJWT')

router.use('/dashboard', userDashboard)
router.post('/session', userController.createSession);
router.post('/register', bodyInputValidator.registerUserValidator, userController.registerUser);
router.post('/login', bodyInputValidator.loginUserValidator, userController.loginUser);
router.post('/verify', bodyInputValidator.jwtTokenVerificationValidator, userController.accessTokenVerification);
router.post('/verifyRefresh', bodyInputValidator.jwtTokenVerificationValidator, userController.refreshTokenVerification);
router.post('/refresh', bodyInputValidator.jwtTokenVerificationValidator, userController.refreshAccessToken);
router.post('/revoke',  userController.revokeRefreshToken);
router.post('/profile', authMiddleware.isAuthenticated, userController.userDetails)

module.exports = router;
