const getServerURL = () => {
	if (window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1")) {
		return "http://localhost:" + 3001;
	}
	return window.location.origin;
}

const Config = {
	isDebug: false,
	isHashRoute: true,
	serverURL: getServerURL(),
};

module.exports = Config;