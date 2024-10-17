const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BlogPost', // Linking to the blog post this comment belongs to
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Author of the comment
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;

