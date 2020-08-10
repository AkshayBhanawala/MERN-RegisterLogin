const router = require('express').Router();
const APIRoutes = require('../helpers/APIRoutesForServer');
const UsersController = require('../controllers/Users.controller');

router.route(APIRoutes.Register).post((req, res) => {
	UsersController.registerUser(req, res);
});

router.route(APIRoutes.Login).post((req, res) => {
	UsersController.loginUser(req, res);
});

router.route(APIRoutes.SendAccountVerificationEmail).post((req, res) => {
	UsersController.sendAccountVerificationEmail(req, res);
});

router.route(APIRoutes.SendPasswordResetEmail).post((req, res) => {
	UsersController.sendPasswordResetEmail(req, res);
});

router.route(`${APIRoutes.Verify}/:token`).post((req, res) => {
	UsersController.verifyAccount(req, res);
});

router.route(`${APIRoutes.PasswordReset}/:token`).post((req, res) => {
	UsersController.passwordReset(req, res);
});

module.exports = router;