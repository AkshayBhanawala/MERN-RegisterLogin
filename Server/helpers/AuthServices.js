const jwt = require('jsonwebtoken');
const Config = require('./Config');

class AuthServices {

	// Set JWT token in cookies - authorization
	setTokenCookie = (res, token) => {
		res = res.cookie('authorization', `Bearer ${token}`, {
			maxAge: Config.jwt_token_expire_in_seconds * 1000, // 1 hour
			httpOnly: true,
			//secure: true, // when network is HTTPS
			sameSite: 'lax',
		});
		return res;
	};

	// Remove JWT token from cookies - authorization
	clearTokenCookie = (res) => {
		res = res.clearCookie('authorization', {
			maxAge: 0,
			httpOnly: true,
			//secure: true, // when network is HTTPS
			sameSite: 'lax'
		});
		return res;
	};

	// Generate JWT token and return with display name of user
	getTokenData = (user) => {
		let token = this.getToken(user);
		let data = {
			uname: user.displayname,
			token: token
		}
		return data;
	};

	// Generate JWT token only
	getToken = (user) => {
		let payload = { email: user.email, displayname: user.displayname, isadmin: user.isadmin }
		let token = jwt.sign(
			payload,
			Config.secret,
			{ expiresIn: Config.jwt_token_expire_in_seconds }
		);
		return token;
	};

	// Verify token from cookies - authorization
	verifyAndDecodeTokenCookie = async (req) => {
		if (req.cookies && req.cookies.authorization) {
			var token = req.cookies.authorization.split(" ")[1];
			try {
				const user = this.verifyToken(token);
				return Promise.resolve(user);
			} catch (err) {
				return Promise.reject({
					error:
					{
						status: 400.2,
						message: "Cookie token expired"
					}
				});
			}
		} else {
			// Token cookie not found
			return Promise.reject({
				error:
				{
					status: 400.1,
					message: "Cookie token not found"
				}
			});
		}
	};

	// Verify token from headers - authorization
	verifyAndDecodeTokenHeader = async (req) => {
		if (req.headers && req.headers.authorization) {
			var token = req.cookies.authorization.split(" ")[1];
			try {
				const user = this.verifyToken(token);
				return Promise.resolve(user);
			} catch (err) {
				return Promise.reject({
					error:
					{
						status: 400.2,
						message: "Header token expired"
					}
				});
			}
		} else {
			// Token cookie not found
			return Promise.reject({
				error:
				{
					status: 400.1,
					message: "Header token not found"
				}
			});
		}
	};

	// Verify token
	verifyToken = async (token) => {
		try {
			var user = jwt.verify(token, Config.secret);
			return Promise.resolve(user);
		} catch (err) {
			// Token not valid
			return Promise.reject({
				error:
				{
					status: 400.9,
					message: "Token not valid"
				}
			});
		}
	};

	// Return validated display name
	validateDisplayName = (displayName) => {
		return displayName.replace(/  +/g, ' ');
	};

	// Standardise error response with status and message
	standardiseErrorObject = (err) => {
		var error = {
			status: 500,
			payload: {
				status: 500,
				message: ''
			}
		};
		if (err.code == 11000) {
			// Error with unique constraints
			// Need to standardise error message
			var errData = {};
			if (err.keyValue.username) {
				errData.username = {
					message: 'Username already registered'
				};
			} else if (err.keyValue.email) {
				errData.email = {
					message: 'Email already registered'
				};
			}
			error.status = 409.1;
			error.payload = errData;
			error.payload.status = error.status;
		} else if (err._message && err._message.includes('validation failed')) {
			// Error with other userdefined constraints
			// Remove extra data and send error object
			Object.keys(err.errors).forEach(key1 => {
				err.errors[key1] = {
					'message': err.errors[key1]['properties']['message']
				}
			});
			error.status = 409.2;
			error.payload = err.errors;
			error.payload.status = error.status;
		} else if (err.errors) {
			// Error with other constraints
			// Remove extra data and send error object
			Object.keys(err.errors).forEach(key1 => {
				Object.keys(err.errors[key1]).forEach(key2 => {
					if (key2 != 'message') {
						delete err.errors[key1][key2];
					}
				});
			});
			error.status = 409.2;
			error.payload = err.errors;
			error.payload.status = error.status;
		} else {
			// Error in other parts of data saving
			console.log('# --> Error: ' + err);
			error.status = 500;
			error.payload = { err };
			error.payload.status = error.status;
		}
		return error;
	};
}

module.exports = new AuthServices();