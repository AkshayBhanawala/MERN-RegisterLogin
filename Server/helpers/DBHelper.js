const Users = require('../models/Users.model');
const Config = require('./Config');
const AuthServices = require('../helpers/AuthServices')

const DBHelper = {
	updateUserAccountVerification: async (user, verified = false) => {
		try {
			var doc = await Users.findOne({ email: user.email });
			try {
				await AuthServices.verifyToken(doc.verification.code);
				if (verified) {
					doc.verification.isverified = true;
					doc.verification.code = "";
				}
			} catch (e) {
				if (!verified) {
					doc.verification.code = AuthServices.getToken(user);
				}
			}
			await doc.save({ validateBeforeSave: false });
			return doc.verification.code;
		} catch (err) {
			return Promise.reject(err);
		}
	},

	updateUserAccountRecoveryCode: async (user, recovered = false) => {
		try {
			var doc = await Users.findOne({ email: user.email });
			try {
				await AuthServices.verifyToken(doc.recoverycode);
				if (recovered) {
					doc.recoverycode = "";
				}
			} catch (e) {
				if (!recovered) {
					doc.recoverycode = AuthServices.getToken(user);
				}
			}
			await doc.save({ validateBeforeSave: false });
			return doc.recoverycode;
		} catch (err) {
			return Promise.reject(err);
		}
	},

	updateUserAccountPassword: async (user) => {
		try {
			var doc = await Users.findOne({ email: user.email });
			doc.password = user.password;
			doc.recoverycode = user.recoverycode;
			return doc.save();
		} catch (err) {
			return Promise.reject(err);
		}
	},

	findOneUser: async (searchCondition) => {
		try {
			return Users.findOne(searchCondition);
		} catch (err) {
			return Promise.reject(err);
		}
	},

}

module.exports = DBHelper;