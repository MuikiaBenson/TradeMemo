const BlogPost = require('../models/BlogPost');

// Create a new blog post
exports.createPost = async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    const newPost = await BlogPost.create({
      title,
      body,
      tags,
      author: req.user._id
    });
    res.status(201).json(newPost);
  } catch (err) {
    console.error('[CREATE POST ERROR]', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// Get all blog posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().populate('author', 'name email');
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Get a blog post by id
exports.getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author', 'name email');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

// Update a blog post
exports.updatePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    Object.assign(post, req.body);
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post' });
  }
};

// Delete a blog post
exports.deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

// Like a blog post
exports.likePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const index = post.likes.findIndex(userId => userId.toString() === req.user._id.toString());
    if (index !== -1) {
      post.likes.splice(index, 1);
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to like post' });
  }
};

// Add comment to a blog post
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = {
      user: req.user._id,
      text,
      createdAt: new Date()
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

