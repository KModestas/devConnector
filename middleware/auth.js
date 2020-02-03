const jwt = require('jsonwebtoken')
const jwtSecret = require('config').get('jwtSecret')

module.exports = async (req, res, next) => {
	// get token from request header
	const token = req.header('x-auth-token')

	if (!token) return res.status(401).json({ msg: 'No token, authorisation denied' })

	// verify token using secret
	try {
		// const decoded = await jwt.verify(token, jwtSecret)
		// // set decoded user to req.user to allow them to access protected routes when making requests
		// req.user = decoded.user
		// move onto the next middleware
		await jwt.verify(token, jwtSecret, (error, decoded) => {
			if (error) {
				res.status(401).json({ msg: 'Token is not valid' })
			} else {
				req.user = decoded.user
				next()
			}
		})
		// next()
	} catch (err) {
		res.status(401).json({ msg: 'invalid token' })
	}
}
