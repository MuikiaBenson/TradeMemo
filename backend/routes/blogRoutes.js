const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const blogController = require('../controllers/blogController');

router.post('/', protect, blogController.createPost);
router.get('/', blogController.getAllPosts);
router.get('/:id', blogController.getPostById);
router.put('/:id', protect, blogController.updatePost);
router.delete('/:id', protect, blogController.deletePost);
router.post('/:id/like', protect, blogController.likePost);
router.post('/:id/comments', protect, blogController.addComment);

module.exports = router;

