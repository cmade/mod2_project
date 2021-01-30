//Bring in express backend framework
const express = require('express');

//Bring in express router
const router = express.Router();

//Bring in the auth middleware
const auth = require('../../middleware/auth');

// Bring in a validator to make sure that we are recieving the right data
const { check, validationResult } = require('express-validator/check');

//Bring in post and user models
const Post = require('../../models/Post');
const User = require('../../models/User');

//Create a route,
//Route       POST api/posts
//Description Create a post
//Access      public
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    //Do some error checking
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//Create a route,
//Route       GET api/posts
//Description Get all posts
//Access      private
router.get('/', auth, async (req, res) => {
  try {
    //Sort the posts from the most recent date
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//Create a route,
//Route       GET api/posts/:id
//Description Get post by ID
//Access      private
router.get('/:id', auth, async (req, res) => {
  try {
    //Grab id from the url
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

//Create a route,
//Route       DELETE api/posts/:id
//Description Delete a post
//Access      private
router.delete('/:id', auth, async (req, res) => {
  try {
    //Grab id from the url
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    //Make sure that the user deleting the post is the user that own the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

//Create a route,
//Route       PUT api/posts/like/:id
//Description Like  a post
//Access      private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //Check if the post has already been like
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    //add the like
    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//Create a route,
//Route       PUT api/posts/unlike/:id
//Description Unlike  a post
//Access      private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //Check if the post has already been like
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length == 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }
    //Get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//Create a route,
//Route       POST api/posts/comment/:id
//Description Comment on a post
//Access      public
router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    //Do some error checking
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //Assign to the user variable
      const user = await User.findById(req.user.id).select('-password');

      //Assign to the post variable
      const post = await Post.findById(req.params.id);
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      //Add to the posts to comments
      post.comments.unshift(newComment);

      //Save comments
      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//Create a route,
//Route       DELETE api/posts/comment/:id/:comment_id
//Description Delete comment
//Access      public
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Get the comment from the post
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    //Check to see if comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    //Check to see if the user that created the comment is the one that is deleting it
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User is not authorized' });
    }

    //Get remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
//Export the router
module.exports = router;
