const Users = require('../models/Users.model');
const APIRoutes = require('../helpers/APIRoutesForServer');
const AuthServices = require('../helpers/AuthServices');
const DBHelper = require('../helpers/DBHelper');
const Config = require('../helpers/Config');
const Mailer = require('../helpers/Mailer');

class UsersController {

	registerUser = async (req, res) => {
		try {
			// Check if someone is logged in or not
			const user = await AuthServices.verifyAndDecodeTokenCookie(req);
			// User already logged in
			res.status(406).send({ status: 406, message: 'A user is already logged in', user: { email: user.email, displayname: user.displayname, isadmin: user.isadmin } });
		} catch (err) {
			// User not logged in
			try {
				var user = new Users(req.body);
				user.isadmin = false;
				user.displayname = AuthServices.validateDisplayName(user.displayname);
				const newUser = await user.save();
				// Registration Successful
				res.status(201).send({ status: 201, user: { email: newUser.email, displayname: newUser.displayname } });
			} catch (err) {
				// Any error in registering
				err = AuthServices.standardiseErrorObject(err);
				res.status(err.status).send(err.payload);
				if (err.status == 500) {
					console.log(err)
				}
			}
		}
	};

	loginUser = async (req, res) => {
		try {
			// Check if someone is logged in or not
			const user = await AuthServices.verifyAndDecodeTokenCookie(req);
			// User already logged in
			res.status(406).send({ status: 406, message: 'A user is already logged in', user: { email: user.email, displayname: user.displayname, isadmin: user.isadmin } });
		} catch (err) {
			// User not logged in
			try {
				var loginData = req.body;
				const user = await DBHelper.findOneUser({
					$or: [
						{ email: loginData.username },
						{ username: loginData.username }
					]
				});
				if (!user) {
					res.status(401.1).send({ status: 401.1, username: { message: 'User does not exist' } });
				} else if (! await user.passwordMatch(loginData.password)) {
					res.status(401.2).send({ status: 401.2, password: { message: 'Password invalid' } });
				} else if (!user.verification.isverified) {
					res.status(401.2).send({ status: 401.3, verification: { message: 'Account is not active' } });
				} else {
					var data = AuthServices.getToken(user);
					res = AuthServices.setTokenCookie(res, data);
					res.status(200).send({ status: 200, user: { email: user.email, displayname: user.displayname, isadmin: user.isadmin } });
				}
			} catch (err) {
				console.log('# Login --> Error:');
				console.log(err);
				res.status(500).send({ status: 500, error: err });
			}
		}
	};

	sendAccountVerificationEmail = async (req, res) => {
		const mailInfo = await this.sendAccountVerificationAndRecoveryEmail(req, res, APIRoutes.Verify);
		if (!mailInfo) {
			return;
		}
		res.status(200).send({ status: 200, message: "Verification email is sent", verifyaccount: { ExpiresInHours: Config.jwt_token_expire_in_hours }, /*mailingInfo: mailInfo*/ });
	};

	sendPasswordResetEmail = async (req, res) => {
		var mailInfo = await this.sendAccountVerificationAndRecoveryEmail(req, res, APIRoutes.PasswordReset);
		if (!mailInfo) {
			return;
		}
		res.status(200).send({ status: 200, message: "Password reset email is sent", passwordreset: { ExpiresInHours: Config.jwt_token_expire_in_hours }, /*mailingInfo: mailInfo*/ });
	};

	verifyAccount = async (req, res) => {
		var user = await this.verifyLink(req, res, APIRoutes.Verify);
		if (!user) {
			return;
		}
		try {
			const data = await DBHelper.updateUserAccountVerification(user, true);
			res.status(200).send({ status: 200, user: { username: user.username }, verification: { message: "Account verified" } });
		} catch (err) {
			console.log('# Verify/:token --> Error:');
			err = AuthServices.standardiseErrorObject(err);
			res.status(500).send(errors.payload);
			if (err.status == 500) {
				console.log(err)
			}
		}
	};

	passwordReset = async (req, res) => {
		var user = await this.verifyLink(req, res, APIRoutes.PasswordReset);
		if (!user) {
			return;
		}
		if ((!req.body.password) || (req.body.password === "")) {
			// Password field is available - to check validity of link
			res.status(202).send({ status: 202, link: { message: "Password rest link is valid" } });
		} else {
			// Password field is available - to update password
			user.password = req.body.password;
			user.recoverycode = "";
			try {
				const data = await DBHelper.updateUserAccountPassword(user, true);
				res.status(200).send({ status: 200, user: { username: user.username }, password: { message: "Password reset success" } });
			} catch (err) {
				err = AuthServices.standardiseErrorObject(err);
				res.status(err.status).send(err.payload);
				if (err.status !== 409.2) {
					console.log('# PasswordReset/:token --> Error:');
					console.log(err);
				}
			}
		}
	};

	sendAccountVerificationAndRecoveryEmail = async (req, res, operation) => {
		try {
			// User already logged in
			var user = await AuthServices.verifyAndDecodeTokenCookie(req);
			res.status(406).send({ status: 406, message: 'A user is already logged in', user: { email: user.email, displayname: user.displayname, isadmin: user.isadmin } });
			return false;
		} catch (err) {
			try {
				// User not logged in
				var websitePublicURLPart = req.body.publicURLPart;
				var loginData = req.body.user;
				const user = await DBHelper.findOneUser({
					$or: [
						{ email: loginData.email },
						{ email: loginData.username },
						{ username: loginData.email },
						{ username: loginData.username }
					]
				});
				if (!user) {
					res.status(401.1).send({ status: 401.1, username: { message: 'User does not exist' } });
					return false;
				} else {
					if (operation === APIRoutes.Verify) {
						if (user.verification.isverified) {
							res.status(401.2).send({ status: 401.2, username: { message: 'Account already verified' } });
							return false;
						}
						const token = await DBHelper.updateUserAccountVerification(user);
						const url = encodeURI(`${Config.websiteDomain}${websitePublicURLPart}/${token}`);
						const mailInfo = await Mailer.sendVerificationMail(user, url);
						return mailInfo;
					} else if (operation === APIRoutes.PasswordReset) {
						const token = await DBHelper.updateUserAccountRecoveryCode(user);
						const url = encodeURI(`${Config.websiteDomain}${websitePublicURLPart}/${token}`);
						const mailInfo = await Mailer.sendPasswordResetMail(user, url);
						return mailInfo;
					}
				}
			} catch (err) {
				console.log('# sendAccountVerificationAndRecoveryEmail --> Error:');
				console.log(err);
				res.status(500).send({ status: 500, error: err });
				return false;
			}
		}
	}

	verifyLink = async (req, res, operation) => {
		try {
			// Check if someone is logged in or not
			const user = await AuthServices.verifyAndDecodeTokenCookie(req);
			res.status(406).send({ status: 406, message: 'A user is already logged in', user: { email: user.email, displayname: user.displayname, isadmin: user.isadmin } });
			return false;
		} catch (err) {
			var token = req.params.token;
			if (token === "undefined" || !token) {
				res.status(408.1).send({ status: 408.1, verification: { message: "Verification code not available" } });
				return false;
			}
			token = decodeURI(token);
			try {
				const userData = await AuthServices.verifyToken(token);
				try {
					const user = await DBHelper.findOneUser({ email: userData.email });
					if (!user) {
						res.status(401.1).send({ status: 401.1, username: { message: 'User does not exist anymore' } });
						return false;
					} else if (operation === APIRoutes.Verify) {
						if (user.verification.isverified) {
							res.status(401.2).send({ status: 401.2, verification: { message: 'Account already verified' } });
							return false;
						} else if (token !== user.verification.code) {
							res.status(401.3).send({ status: 401.3, verification: { message: 'Link is not valid for verification' } });
							return false;
						}
					} else {
						if (user.recoverycode === "") {
							res.status(401.2).send({ status: 401.2, passwordreset: { message: 'Link has already been used' } });
							return false;
						} else if (token !== user.recoverycode) {
							res.status(401.3).send({ status: 401.3, passwordreset: { message: 'Link is not valid for password reset' } });
							return false;
						}
					}
					// Verification token is 100% valid
					return user;
				} catch (err) {
					// Database error
					console.log('# verifyLink/:token --> Error:');
					console.log(err);
					res.status(500).send({ status: 500, error: err });
					return false;
				}
			} catch (err) {
				res.status(408.2).send({ status: 408.2, verification: { message: "Link expired or is invalid" } });
				return false;
			}
		}
	}
}

module.exports = new UsersController();