
class _TestController {

	test = (req, res) => {
		const mongoose = require('../server');
		const data = {
			status: 200,
			Server: "Running",
			DB: mongoose.STATES[mongoose.connection.readyState]
		};
		res.status(200).send(data);
	}

}

module.exports = new _TestController();