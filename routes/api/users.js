//Bring in express backend framework
const express = require('express');

//Bring in express router
const router = express.Router();

// Bring in a validator to make sure that we are recieving the right data
const { check, validationResult } = require('express-validator/check');

// Bring in user model
const User = require('../../models/User');

// Bring in the gravatar, so we can use it to get the image
const gravatar = require('gravatar');

// Bring in password encryption Bcrypt
const bcrypt = require('bcryptjs');

// Bring in Json web token dependency
const jwt = require('jsonwebtoken');

//Bring in json web token secret
const config = require('config');

//Create a route,
//Route       POST api/users
//Description Register user
//Access      public
router.post(
  '/',
  //Validation for name, email and password
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    //Handle the response
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //This will send back a bad request and an array of errors if the data is invalid
      return res.status(400).json({ errors: errors.array() });
    }
    // Destructuer req.body, so we dont have to keep typing req.body
    const { name, email, password } = req.body;

    // Do a search for the user
    try {
      // See if the user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      // Get users gravatar
      const avatar = gravatar.url(email, {
        //Default size
        s: '200',
        //Rating, (keep it clean)
        r: 'pg',
        //Default image
        d: 'mm',
      });

      //Create instance of user
      user = new User({
        name,
        email,
        avatar,
        password,
      });
      // Encrypt password
      // Create a salt to do the hashing , ten rounds is what is recommended in the documentation but the more rounds you have the more secure.
      const salt = await bcrypt.genSalt(10);

      // Take the password and hash it
      user.password = await bcrypt.hash(password, salt);

      // Save the user to the database, remember that everything that returns a promise needs an await
      await user.save();

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
