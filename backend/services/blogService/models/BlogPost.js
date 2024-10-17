const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogPostSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you already have a User model
        required: true,
    },
    tags: [{
        type: String,
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // To track who liked the post
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment', // Referencing the Comment model
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
module.exports = BlogPost;

