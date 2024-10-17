const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');

// Create a new blog post
exports.createPost = async (req, res) => {
    try {
        const { title, body, tags } = req.body;
        const newPost = new BlogPost({
            title,
            body,
            tags,
            author: req.user.id, // Assuming `req.user` contains the authenticated user
        });
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(500).json({ message: 'Error creating post', error: err.message });
    }
};

// Edit a blog post
exports.editPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, body, tags } = req.body;
        const post = await BlogPost.findById(postId);

        if (!post || post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to edit this post' });
        }

        post.title = title || post.title;
        post.body = body || post.body;
        post.tags = tags || post.tags;
        post.updatedAt = Date.now();

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: 'Error editing post', error: err.message });
    }
};

// Delete a blog post
exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await BlogPost.findById(postId);

        if (!post || post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to delete this post' });
        }

        await BlogPost.deleteOne({ _id: postId });
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting post', error: err.message });
    }
};

// Like or Unlike a blog post
exports.likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await BlogPost.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const userId = req.user.id;
        const index = post.likes.indexOf(userId);

        if (index === -1) {
            post.likes.push(userId); // Like the post
        } else {
            post.likes.splice(index, 1); // Unlike the post
        }

        await post.save();
        res.status(200).json({ likes: post.likes.length });
    } catch (err) {
        res.status(500).json({ message: 'Error liking post', error: err.message });
    }
};

// Add a comment to a blog post
exports.addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const postId = req.params.id;

        const post = await BlogPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = new Comment({
            content,
            postId,
            author: req.user.id, // Assuming `req.user` contains the authenticated user
        });

        const savedComment = await newComment.save();

        // Update the blog post with the new comment
        post.comments.push(savedComment._id);
        await post.save();

        res.status(201).json(savedComment);
    } catch (err) {
        res.status(500).json({ message: 'Error adding comment', error: err.message });
    }
};


// Get posts for the feed (basic example)
exports.getFeed = async (req, res) => {
    try {
        const posts = await BlogPost.find()
            .populate('author', 'name')
            .populate('comments') // Populating comments if needed
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching feed', error: err.message });
    }
};
