const jwt = require('jsonwebtoken')
const jwtSecret = require('config').get('jwtSecret')

module.exports = (req, res, next) => {
	// get token from request header
	const token = req.header('x-auth-token')

	if (!token) return res.status(401).json({ msg: 'No token, authorisation denied' })

	// verify token using secret
	try {
		const decoded = jwt.verify(token, jwtSecret)

		req.user = decoded.user
		// move onto the next middleware
		next()
	} catch (err) {
		res.status(401).json({ msg: 'invalid token' })
	}
}
