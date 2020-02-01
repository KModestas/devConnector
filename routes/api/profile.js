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

const profileValidation = [
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
router.post('/', [auth, profileValidation], async (req, res) => {
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

// @route GET api/profile/user/:user_id
// @desc Get profile by user Id
// @acess Public
router.get('/user/:user_id', async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', [
			'name',
			'avatar'
		])
		const Err400 = () => res.status(400).json({ msg: 'Profile not found' })
		if (!profile) return Err400()
		res.json(profiles)
		//
	} catch (err) {
		console.error(err.message)
		// if invalid user_id is entered into URL, rather than throwing server error, return 400 error
		if (err.kind === 'ObjectId') return Err400()
		res.status(500).send('Server Error')
	}
})

// @route GET api/profile/user/:user_id
// @desc Get profile by user Id
// @acess Public
router.get('/user/:user_id', async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', [
			'name',
			'avatar'
		])
		const Err400 = () => res.status(400).json({ msg: 'Profile not found' })
		if (!profile) return Err400()
		res.json(profiles)
		//
	} catch (err) {
		console.error(err.message)
		// if invalid user_id is entered into URL, rather than throwing server error, return 400 error
		if (err.kind === 'ObjectId') return Err400()
		res.status(500).send('Server Error')
	}
})

// @route DELETE api/profile
// @desc Delete profile, user, posts
// @acess Private
router.delete('/', auth, async (req, res) => {
	try {
		// @todo - remove user posts
		// remove Profile from db
		await Profile.findOneAndRemove({ user: req.user.id })
		// remove User from db
		await User.findOneAndRemove({ _id: req.user.id })

		res.json({ msg: 'User deleted' })
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Server Error')
	}
})

const experienceValidation = [
	check('title', 'Title is required')
		.not()
		.isEmpty(),
	check('company', 'Company is required')
		.not()
		.isEmpty(),
	check('from', 'From date is required')
		.not()
		.isEmpty()
]

// @route PUT api/profile
// @desc Add profile experience
// @acess Private
router.put('/experience', [auth, experienceValidation], async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

	// destructure properties from req.body and store in newExperience
	const newExperience = ({ title, company, location, from, to, current, description } = req.body)

	try {
		// add new experience to start of experience array
		const profile = await Profile.findOne({ user: req.user.id })
		profile.experience.unshift(newExperience)
		await profile.save()

		res.json(profile)
		//
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Server Error')
	}
})

// @route DELETE api/profile/experience/:exp_id
// @desc Delete profile experience
// @acess Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
	try {
		// add new experience to start of experience array
		const profile = await Profile.findOne({ user: req.user.id })

		// get index of profile experience to remove
		const index = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

		profile.experience.splice(index, 1)

		await profile.save()

		res.json(profile)
		//
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Server Error')
	}
})

// @route DELETE api/profile
// @desc Delete profile, user, posts
// @acess Private
router.delete('/', auth, async (req, res) => {
	try {
		// @todo - remove user posts
		// remove Profile from db
		await Profile.findOneAndRemove({ user: req.user.id })
		// remove User from db
		await User.findOneAndRemove({ _id: req.user.id })

		res.json({ msg: 'User deleted' })
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Server Error')
	}
})

const educationValidation = [
	check('school', 'School is required')
		.not()
		.isEmpty(),
	check('degree', 'Degree is required')
		.not()
		.isEmpty(),
	check('fieldofstudy', 'Field of study is required')
		.not()
		.isEmpty(),
	check('from', 'From date is required')
		.not()
		.isEmpty()
]

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put('/education', [auth, educationValidation], async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

	// destructure properties from req.body and store in newExperience
	const newEducation = ({ school, degree, fieldofstudy, from, to, current, description } = req.body)

	try {
		// add new education to start of experience array
		const profile = await Profile.findOne({ user: req.user.id })
		profile.education.unshift(newEducation)
		await profile.save()

		res.json(profile)
		//
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Server Error')
	}
})

// @route DELETE api/profile/education/:edu_id
// @desc Delete profile education
// @acess Private
router.delete('/education/:edu_id', auth, async (req, res) => {
	try {
		// add new education to start of education array
		const profile = await Profile.findOne({ user: req.user.id })

		// get index of profile education to remove
		const index = profile.education.map(item => item.id).indexOf(req.params.edu_id)

		profile.education.splice(index, 1)

		await profile.save()

		res.json(profile)
		//
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Server Error')
	}
})

module.exports = router
