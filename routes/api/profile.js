const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const request = require('request')
const githubClientId = require('config').get('githubClientId')
const githubClientSecret = require('config').get('githubClientSecret')

const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')

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

	const profileFields = ({
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
	} = req.body)

	// skills will be a string for new profiles and an array for exisiting edited profiles
	if (skills)
		profileFields.skills =
			typeof skills === 'string' ? skills.split(',').map(skill => skill.trim()) : skills

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
		// Using upsert option (creates new doc if no match is found):
		const profile = await Profile.findOneAndUpdate(
			{ user: req.user.id },
			{ $set: profileFields },
			{ new: true, upsert: true }
		)

		console.log('profile ', profile)

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
		console.error(err.message)
		res.status(500).send('Server Error')
	}
})

// @route GET api/profile/user/:user_id
// @desc Get profile by user Id
// @acess Public
router.get('/user/:user_id', async (req, res) => {
	// scoped to whole route
	const err400 = () => res.status(400).json({ msg: 'Profile not found' })
	try {
		const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', [
			'name',
			'avatar'
		])
		if (!profile) return err400()
		res.json(profile)
		//
	} catch (err) {
		console.error(err.message)
		// if invalid user_id is entered into URL, rather than throwing server error, return 400 error
		if (err.kind === 'ObjectId') return err400()
		res.status(500).send('Server Error')
	}
})

// @route DELETE api/profile
// @desc Delete profile, user, posts
// @acess Private
router.delete('/', auth, async (req, res) => {
	try {
		// remove user posts
		await Post.deleteMany({ user: req.user.id })
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

// @route GET api/profile/github/:username
// @desc Get user repos from github
// @acess Public
router.get('/github/:username', auth, (req, res) => {
	try {
		// options for request to github api
		// uri is encoded using encodeURI()
		const options = {
			uri: encodeURI(
				`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${githubClientId}&client_secret=${githubClientSecret}`
			),
			method: 'GET',
			headers: { 'user-agent': 'node.js' }
		}
		// make http request using request (like axios)
		request(options, (error, response, body) => {
			if (error) console.log(error)
			if (response.statusCode !== 200) {
				return res.status(400).json({ msg: 'No github profile found' })
			}
			// if the github profile is found, parse the body (because its a string) and send it back to your client
			res.json(JSON.parse(body))
		})
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Server Error')
	}
})

module.exports = router
