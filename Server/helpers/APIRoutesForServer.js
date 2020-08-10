const APIRoutesForServer = {
	IsLoggedIn: "/IsLoggedIn",
	Register: "/Register",
	Login: "/Login",
	Logout: "/Logout",
	SendAccountVerificationEmail: "/SendAccountVerificationEmail",
	SendPasswordResetEmail: "/SendPasswordResetEmail",
	Verify: "/Verify", // Used in mail module
	PasswordReset: "/PasswordReset", // Used in mail module
	Test: "/Test"
}
module.exports = APIRoutesForServer;