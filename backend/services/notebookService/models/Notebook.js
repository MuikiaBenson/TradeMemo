const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Note Schema
const NoteSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Define Notebook Schema
const NotebookSchema = new Schema({
    name: { type: String, required: true },
    color: { type: String, default: 'blue' }, // default category color
    favorite: { type: Boolean, default: false },
    notes: [NoteSchema],  // Array of notes
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    owner: { type: Schema.Types.ObjectId, ref: 'User' } // link to user
});

module.exports = mongoose.model('Notebook', NotebookSchema);

