const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { authMiddleware } = require('../middlewares/auth'); // Assuming you have authentication middleware

// Routes for creating, editing, and deleting blog posts
router.post('/create', authMiddleware, blogController.createPost);
router.put('/edit/:id', authMiddleware, blogController.editPost);
router.delete('/delete/:id', authMiddleware, blogController.deletePost);

// Routes for liking and commenting on posts
router.post('/like/:id', authMiddleware, blogController.likePost);
router.post('/comment/:id', authMiddleware, blogController.addComment);

// Route to get posts (feed)
router.get('/feed', blogController.getFeed);

module.exports = router;

