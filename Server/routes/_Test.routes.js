const router = require('express').Router();
const APIRoutes = require('../helpers/APIRoutesForServer');
const _TestController = require('../controllers/_Test.controller');

router.route(APIRoutes.Test).get((req, res) => {
	_TestController.test(req, res);
});

module.exports = router;