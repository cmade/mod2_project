//Bring in Json web token
const jwt = require('jsonwebtoken');

//Bring in config because we need the secret
const config = require('config');

//Export middleware function
module.exports = function (req, res, next) {
  // Get the token from the header
  const token = req.header('x-auth-token');

  // Check to see if there is no token
  if (!token) {
    //Returns a 401 which is not authorized
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  //Verify the token if there is one
  try {
    //This will decode the token through the verify function and store it in the decoded object
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    // Take the request object and assign the value to user
    req.user = decoded.user;

    next();
  } catch (err) {
    // The catch will run if the token is not valid
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
