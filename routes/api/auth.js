//Bring in express backend framework
const express = require('express');

//Bring in the custom middleware
const auth = require('../../middleware/auth');

//Bring in express router
const router = express.Router();

//Bring in user
const User = require('../../models/User');

// Bring in a validator to make sure that we are recieving the right data
const { check, validationResult } = require('express-validator/check');

//Bring in json web token secret
const config = require('config');

// Bring in Json web token dependency
const jwt = require('jsonwebtoken');

// Bring in password encryption Bcrypt
const bcrypt = require('bcryptjs');

//Create a route,
//Route       GET api/auth
//Description Test route
//Access      public
//Add auth as the seconde parameter to make the route protected
router.get('/', auth, async (req, res) => {
  try {
    // Find the user by id but remove the password property
    const user = await User.findById(req.user.id).select('-password');
    // Return the response in json
    res.json(user);
  } catch (err) {
    // Log to the console the error message
    console.error(err.message);
    // The status response should come back with the message of a server err
    res.status(500).send('Server error');
  }
});

//Create a route,
//Route       POST api/auth
//Description Authenticate user & get token
//Access      public
router.post(
  '/',
  //Validation for email and password
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    //Handle the response
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //This will send back a bad request and an array of errors if the data is invalid
      return res.status(400).json({ errors: errors.array() });
    }
    // Destructuer req.body, so we dont have to keep typing req.body
    const { email, password } = req.body;

    // Do a search for the user
    try {
      // See if the user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      //Check to see if the password matches
      //Bcrypt has a method called compare which takes a plain text password and an encrypted password and compares them and tells you if they are a match or not. Compare returns a promise
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // Return Json Web Token, and create payload
      const payload = {
        user: {
          id: user.id,
        },
      };
      //Sign the token
      jwt.sign(
        //Pass it the payload
        payload,
        //Pass it the secret
        config.get('jwtSecret'),
        //Add optional expiration
        { expiresIn: 360000 },
        (err, token) => {
          // Check for err
          if (err) throw err;
          // This will allow us to access protected routes
          res.json({ token });
        }
      );
    } catch (err) {
      //Display error message in the console
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

//Export the router
module.exports = router;
