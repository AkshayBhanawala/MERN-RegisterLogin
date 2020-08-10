const bCrypt = require("bcryptjs");
const Mongoose = require('mongoose');
const Config = require('../helpers/Config');

const usersSchema = new Mongoose.Schema({
	email: {
		type: String,
		required: [true, 'Email is required'],
		unique: [true, 'Email already registered'],
		trim: true,
		lowercase: true,
		minlength: [10, 'Email must have atleast 10 characters'],
		maxlength: [50, 'Email must not exceed 50 characters']
	},
	username: {
		type: String,
		required: [true, 'Username is required'],
		unique: [true, 'Someone else is using this username'],
		trim: true,
		lowercase: true,
		match: [/^[A-Za-z][A-Za-z0-9].*$/, 'Username allowed characters are A-Z and 0-9 and must start with letter'],
		minlength: [3, 'Username must have atleast 3 Characters'],
		maxlength: [20, 'Username must not exceed 20 characters']
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
		minlength: [6, 'Passowrd must have atleast 6 Characters'],
		maxlength: [20, 'Passowrd must not exceed 20 characters'],
	},
	displayname: {
		type: String,
		required: [true, 'What to call you?'],
		trim: true,
		match: [/^[A-Za-z ]+$/, 'Name must only have Letters and Space'],
		minlength: [2, 'Name must have atleast 2 Characters'],
		maxlength: [20, 'Name must not exceed 20 characters']
	},
	isadmin: {
		type: Boolean,
		default: false
	},
	verification: {
		isverified: {
			type: Boolean,
			default: false
		},
		code: {
			type: String,
			trim: true
		}
	},
	recoverycode: {
		type: String,
		trim: true
	},
}, {
	timestamps: true,
});

/**
 ********************************************
 * Methods
 ********************************************
 */
usersSchema.methods.passwordEncrypt = async function (textPasssword = undefined) {
	if (!textPasssword) {
		// if not called by save method object
		textPasssword = this.password;
	}
	return await bCrypt.hash(textPasssword, Config.bCrypt_saltRounds);
};

usersSchema.methods.passwordMatch = async function (textPasssword) {
	// Encrypt and compare password
	return await bCrypt.compare(textPasssword, this.password);
};

/*
 ********************************************
 * Hooks
 ********************************************
 */
usersSchema.pre("save", async function (next) {
	// Encrypt password before saving
	if (!this.isModified("password")) {
		// check if the user is being created or changed
		return next();
	}
	this.password = await this.passwordEncrypt();
});

const Users = Mongoose.model('Users', usersSchema);

module.exports = Users;
/*
	use following to use this indexed schema
	because we have unique fields in this schema

	before(async () => {
		await require('../models/Users.model');
	});
*/