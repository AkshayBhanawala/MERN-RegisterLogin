const Config = require("./Config");

const APIRoutesForClient = {
	IsLoggedIn: `${Config.serverURL}/IsLoggedIn`,
	Register: `${Config.serverURL}/Register`,
	Login: `${Config.serverURL}/Login`,
	Logout: `${Config.serverURL}/Logout`,
	SendAccountVerificationEmail: `${Config.serverURL}/SendAccountVerificationEmail`,
	SendPasswordResetEmail: `${Config.serverURL}/SendPasswordResetEmail`,
	Verify: `${Config.serverURL}/Verify`, // Used in mail module
	PasswordReset: `${Config.serverURL}/PasswordReset` // Used in mail module
};

module.exports = APIRoutesForClient;