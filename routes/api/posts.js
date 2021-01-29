//Bring in express backend framework
const express = require('express');

//Bring in express router
const router = express.Router();

//Create a route,
//Route       GET api/posts
//Description Test route
//Access      public
router.get('/', (req, res) => res.send('Post route'));

//Export the router
module.exports = router;
