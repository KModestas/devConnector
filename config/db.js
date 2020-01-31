// set up a seprate file to confirgure the database
const mongoose = require('mongoose')
// use config (similar to env variables) to get the db key
const config = require('config')
const db = config.get('mongoURI')

// NOTE - using private serach engines like duck duck GO can alter your ip address which will need to be whitelisted

// use async await to connect to mongoDb, if theres an error, log it and stop the application
const connectDB = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			// useCreateIndex: true,
			useUnifiedTopology: true
		})
		console.log('MongoDB connected')
	} catch (err) {
		console.error(err.message)
		process.exit(1)
	}
}

module.exports = connectDB
