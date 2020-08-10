const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
//const path = require('path');
const Config = require('./helpers/Config');
const cookieParser = require('cookie-parser')

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

//	Server Side ==================================
app.use(cors({
	origin: Config.websiteDomain,
	credentials: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(express.json());
app.use(cookieParser());

//	Routes Module ==================================
const _Test = require('./routes/_Test.routes');
const AuthRouter = require('./routes/Auth.routes');
const UsersRouter = require('./routes/Users.routes');
app.use('/', _Test);
app.use('/', AuthRouter);
app.use('/', UsersRouter);
app.listen(port, () => {
	console.log(`-----> Server is running on port: ${port}`);
});

//  Routes to React BUILD App ==================================
/*app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});*/

//	Database Side ==================================
const DBURI = Config.get_mongodb_CN_string();
mongoose.connect(DBURI, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useCreateIndex: true
});
mongoose.connection.once('open', () => {
	console.log("-----> MongoDB State: " + mongoose.STATES[mongoose.connection.readyState]);
});

module.exports = mongoose;
