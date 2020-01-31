const mongosoe = require('mongoose')

const UserSchema = new mongosoe.Schema({
	name: {
		type: String,
		trim: true,
		required: true
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	password: {
		type: String,
		trim: true,
		required: true
	},
	avatar: {
		type: String
	},
	date: {
		type: Date,
		default: Date.now()
	}
	// will automatically create fields for when created or edited
	// timestamps: true
})
