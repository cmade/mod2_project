//Bring in express backend framework
const express = require('express');

//Bring in express router
const router = express.Router();

//Bring in the auth middleware
const auth = require('../../middleware/auth');

//Bring in the Profile and User model
const Profile = require('../../models/Profile');
const User = require('../../models/User');

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

//Export the router
module.exports = router;
