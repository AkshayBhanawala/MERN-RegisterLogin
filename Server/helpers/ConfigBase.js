const MailingAccounts = require('./MailingAccounts');

const ConfigBase = {
	secret: 'ThisIsAVerySecureSecretKeyDoNotTouchIT',
	jwt_token_expire_in_seconds: 60 * 60, // 1 hour,
	bCrypt_saltRounds: 10,

	// Local Config
	websiteDomain: 'http://localhost:3000',
	mongodb_CN: {
		protocol: 'mongodb',
		username: undefined,
		password: undefined,
		domain: 'localhost',
		port: 27017,
		database: 'MERNRegisterLogin'
	},

	// Deploy Config
	/*******DELETED*******/

	mailAccount: MailingAccounts.Ethereal,
	//mailAccount: MailingAccounts.Zoho,
};

module.exports = ConfigBase;
