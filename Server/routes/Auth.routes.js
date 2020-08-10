const router = require('express').Router();
const APIRoutes = require('../helpers/APIRoutesForServer');
const AuthController = require('../controllers/Auth.controller');

router.route(APIRoutes.IsLoggedIn).post((req, res) => {
	AuthController.isLoggedIn(req, res);
});

router.route(APIRoutes.Logout).post((req, res) => {
	AuthController.logout(req, res);
});

module.exports = router;