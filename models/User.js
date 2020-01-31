const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
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
})

// export schema as User
module.exports = User = mongoose.model('user', UserSchema)
