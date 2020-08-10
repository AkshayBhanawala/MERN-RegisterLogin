const Mongoose = require('mongoose');

const tagsSchema = new Mongoose.Schema({
	_id: {
		type: Schema.Types.ObjectId,
		index: true,
		required: true,
		auto: true,
	},
	displayname: {
		type: String,
		required: true,
		trim: true,
		unique: [true, 'Tag already added'],
		/*minlength: [2, 'Tag must have atleast 2 Characters']*/
	},
}, {
	timestamps: true,
});

const Tags = Mongoose.model('Tags', tagsSchema);

module.exports = Tags;

/*
	use following to use this indexed schema
	because we have unique fields in this schema

	before(async () => {
		await require('../models/Tags.model');
	});
*/