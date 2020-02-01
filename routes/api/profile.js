const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route GET api/profile/me
// @desc Get current user profile
// @acess Private
router.get('/me', auth, async (req, res) => {
	try {
		// get user profile and also add name and avatar fields from user schema onto this query (because Profile schema doesnt have  those properties)
		const profile = await Profile.findOne({ user: req.user.id }).populate('user', [
			'name',
			'avatar'
		])
		if (!profile) return res.status(400).json({ msg: 'There is no profile for this user' })
		// send back user profile data to client
		res.json(profile)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Server Error')
	}
})

const validation = [
	check('status', 'status is required')
		.not()
		.isEmpty(),
	check('skills', 'skills is required')
		.not()
		.isEmpty()
]

// @route POST api/profile
// @desc Create or update user profile
// @acess Private
router.post('/', [auth, validation], async (req, res) => {
	// pass in req to validationResult, which validations all fields
	const errors = validationResult(req)
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

	const {
		company,
		website,
		location,
		bio,
		status,
		githubusername,
		skills,
		youtube,
		facebook,
		twitter,
		instagram,
		linkedin
	} = req.body

	const profileFields = {}
	profileFields.user = req.user.id
	if (company) profileFields.company = company
	if (website) profileFields.website = website
	if (location) profileFields.location = location
	if (bio) profileFields.bio = bio
	if (status) profileFields.status = status
	if (githubusername) profileFields.githubusername = githubusername
	if (skills) profileFields.skills = skills.split(',').map(skill => skill.trim())

	// Build social object
	profileFields.social = {}
	if (youtube) profileFields.social.youtube = youtube
	if (twitter) profileFields.social.twitter = twitter
	if (facebook) profileFields.social.facebook = facebook
	if (linkedin) profileFields.social.linkedin = linkedin
	if (instagram) profileFields.social.instagram = instagram
	// TRY THIS LATER
	// for (key in props) {
	// 	// if key is defined
	// 	if (props[key]) {
	// 		// if key is skills, split into array and trim
	// 		key === 'skills'
	// 			? props[key].split(',').map(skill => skill.trim())
	// 			: (profileFields[key] = props[key])
	// 	}
	// }

	try {
		let profile = await Profile.findOne({ user: req.user.id })

		// UPDATE existing profile
		if (profile) {
			// new true returns the newly updated document rather than the original prior to the update
			await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
			return res.json(profile)
		}

		// CREATE new Profile
		profile = new Profile(profileFields)
		await profile.save()
		return res.json(profile)
		//
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Server Error')
	}
})

// @route GET api/profile
// @desc Get all profiles
// @acess Public
router.get('/', async (req, res) => {
	try {
		const profiles = await Profile.find().populate('user', ['name', 'avatar'])
		res.json(profiles)
	} catch (err) {
		console.log(object)
	}
})

module.exports = router
