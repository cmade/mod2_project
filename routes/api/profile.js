//Bring in express backend framework
const express = require('express');

//Bring in express router
const router = express.Router();

//Bring in the auth middleware
const auth = require('../../middleware/auth');

// Bring in a validator to make sure that we are recieving the right data
const { check, validationResult } = require('express-validator/check');

//Bring in the Profile and User model
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//Bring in the request
const request = require('request');

//Bring the secret and client id for github
const config = require('config');

//Create a route,
//Route       GET api/profile/me
//Description Get current users profile
//Access      private
// Add auth as a second parameter to protect the route
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);
    // Check to see if there is a profile
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//Create a route,
//Route       POST api/profile
//Description Create or update a users profile
//Access      private
// Add auth as a second parameter to protect the route
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    //Assign validation to the errors variable
    const errors = validationResult(req);

    //check to see if there are errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // destructure the request, pull all of the items out of the request.body
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
      linkedin,
    } = req.body;

    //Build profile object
    const profileFields = {};

    //Initialize user
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    // Build social object
    //Initialize social
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      //Look for a profile by the user
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      //Create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//Create a route,
//Route       GET api/profile
//Description Get all profiles
//Access      public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.send(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//Create a route,
//Route       GET api/profile/user/:user_id
//Description Get profile by user id
//Access      public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) return res.status(400).json({ msg: 'Profile not found' });
    res.send(profile);
  } catch (err) {
    console.error(err.message);
    //Search for an error and return the same maessge for security
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server error');
  }
});

//Create a route,
//Route       DELETE api/profile
//Description Deletes profile,  user and post
//Access      private
// Add auth as a second parameter to protect the route
router.delete('/', auth, async (req, res) => {
  try {
    // Remove user posts
    // Remove profile
    // Remove user
    await Promise.all([
      Profile.findOneAndRemove({ user: req.user.id }),
      User.findOneAndRemove({ _id: req.user.id }),
    ]);

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//Create a route,
//Route       PUT api/profile/experience
//Description Add profile experience
//Access      private
// Add auth as a second parameter to protect the route
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required'),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;
    //This will create an object with the data the user submits
    const newExp = { title, company, location, from, to, current, description };
    try {
      // req is the token
      const profile = await Profile.findOne({ user: req.user.id });
      //profile experience is an array. unshift is like push, but it adds to the beginning of the array instead of the end
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//Create a route,
//Route       DELETE api/profile/experience/:exp_id
//Description Delete experience from profile
//Access      private
// Add auth as a second parameter to protect the route
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //Get the remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//Create a route,
//Route       PUT api/profile/education
//Description Add profile education
//Access      private
// Add auth as a second parameter to protect the route
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'field of study is required'),
    ],
  ],
  async (req, res) => {
    //Check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //Destructering
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;
    //Create a new education object
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    try {
      // req is the token
      const profile = await Profile.findOne({ user: req.user.id });
      //profile experience is an array. unshift is like push, but it adds to the beginning of the array instead of the end
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//Create a route,
//Route       DELETE api/profile/experience/:eedu_id
//Description Delete experience from profile
//Access      private
// Add auth as a second parameter to protect the route
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // Get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//Create a route,
//Route       GET api/profile/github/:username
//Description Get user repositories from github
//Access      public
router.get('/github/:username', async (req, res) => {
  try {
    //Grab github profil uri
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };
    request(options, (error, response, body) => {
      if (error) console.error(error);
      if (response) {
      }
    });
  } catch (err) {
    console.error(err.message);
    return res.status(404).json({ msg: 'No Github profile found' });
  }
});

//Export the router
module.exports = router;
