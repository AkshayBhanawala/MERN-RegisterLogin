const RoutesForClient = {
	Welcome: `/`,
	Register: `/Register`,
	Login: `/Login`,
	Logout: `/Logout`,
	VerifyAccount: `/VerifyAccount`,
	Verify: `/Verify`,
	ForgotPassword: `/ForgotPassword`,
	PasswordReset: `/PasswordReset`,
	AfterLogin: `/Users`,
	Admin: {
		Home: `/Users/Admin`
	},
	User: {
		Home: `/Users/User`
	},
};

module.exports = RoutesForClient;