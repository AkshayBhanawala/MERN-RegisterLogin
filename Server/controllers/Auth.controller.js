const AuthServices = require('../helpers/AuthServices');

class AuthController {

	isLoggedIn = async (req, res) => {
		try {
			const user = await AuthServices.verifyAndDecodeTokenCookie(req);
			// User already logged in
			res.status(200).send({ status: 200, isLoggedIn: true, user: user });
		} catch (err) {
			// User not logged in
			res.status(200).send({ status: 200, isLoggedIn: false });
		}
	}

	logout = async (req, res) => {
		res = AuthServices.clearTokenCookie(res);
		res.status(200).send({ status: 200, isLoggedIn: false, headers: res.getHeaders() });
	}

}

module.exports = new AuthController();