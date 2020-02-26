const jwt = require('jsonwebtoken')
const jwtSecret = require('config').get('jwtSecret')

module.exports = async (req, res, next) => {
	// get token from request header
	const token = req.header('x-auth-token')

	if (!token) return res.status(401).json({ msg: 'No token, authorisation denied' })

	// at this point req.user is UNDEFINED
	// verify token using secret, if invalid return error
	// if successful,  ecode the token and retrieve the userId, then set it to req.user.id so that you can use it to get user data (in /me route)
	try {
		await jwt.verify(token, jwtSecret, (error, decoded) => {
			if (error) res.status(401).json({ msg: 'Token is not valid' })
			else {
				req.user = decoded.user
				// decoded.user => { id: '5e343dd888346a2b366c2105' }
				next()
			}
		})
	} catch (err) {
		res.status(401).json({ msg: 'invalid token' })
	}
}
