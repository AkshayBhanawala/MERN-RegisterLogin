const Mongoose = require('mongoose');

const questionsSchema = new Mongoose.Schema({
	_id: {
		type: Schema.Types.ObjectId,
		index: true,
		required: true,
		auto: true,
	},
	question: {
		type: String,
		required: [true, 'Question is required'],
		unique: [true, 'Question already added'],
		trim: true
	},
	answers: {
		type: [{
			type: String
		}],
		required: [true, 'Question is required'],
	},
	tags: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'Tags'
		}],
	},
}, {
	timestamps: true,
});

const Questions = Mongoose.model('Questions', questionsSchema).init();

module.exports = Questions;

/*
	use following to use this indexed schema
	because we have unique fields in this schema

	before(async () => {
		await require('../models/Questions.model');
	});
*/