const Notebook = require('../models/Notebook');
const Note = require('../models/Note');

// Create a new notebook (category)
exports.createNotebook = async (req, res) => {
    try {
        const { name, color } = req.body;
        const newNotebook = new Notebook({
            name,
            color,
            owner: req.user.id, // Assuming `req.user` contains the authenticated user
        });
        const savedNotebook = await newNotebook.save();
        res.status(201).json(savedNotebook);
    } catch (err) {
        res.status(500).json({ message: 'Error creating notebook', error: err.message });
    }
};

// Get all notebooks for a user
exports.getNotebooks = async (req, res) => {
    try {
        const notebooks = await Notebook.find({ owner: req.user.id });
        res.status(200).json(notebooks);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving notebooks', error: err.message });
    }
};

// Add a note to a notebook
exports.addNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const notebook = await Notebook.findById(req.params.notebookId);

        if (!notebook || notebook.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to add note to this notebook' });
        }

        const newNote = new Note({
            title,
            content,
            notebook: notebook._id,
        });

        const savedNote = await newNote.save();
        notebook.notes.push(savedNote._id);
        await notebook.save();

        res.status(201).json(savedNote);
    } catch (err) {
        res.status(500).json({ message: 'Error adding note', error: err.message });
    }
};

// Edit a note in a notebook
exports.editNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const note = await Note.findById(req.params.noteId);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        note.title = title || note.title;
        note.content = content || note.content;
        note.updatedAt = Date.now();
        const updatedNote = await note.save();

        res.status(200).json(updatedNote);
    } catch (err) {
        res.status(500).json({ message: 'Error editing note', error: err.message });
    }
};

// Delete a note from a notebook
exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.noteId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        await Note.deleteOne({ _id: req.params.noteId });
        await Notebook.updateOne({ _id: note.notebook }, { $pull: { notes: req.params.noteId } });

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting note', error: err.message });
    }
};

// Rename a notebook
exports.renameNotebook = async (req, res) => {
    try {
        const { name } = req.body;
        const notebook = await Notebook.findById(req.params.notebookId);

        if (!notebook || notebook.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to rename this notebook' });
        }

        notebook.name = name || notebook.name;
        notebook.updatedAt = Date.now();
        const updatedNotebook = await notebook.save();
        res.status(200).json(updatedNotebook);
    } catch (err) {
        res.status(500).json({ message: 'Error renaming notebook', error: err.message });
    }
};

// Delete a notebook
exports.deleteNotebook = async (req, res) => {
    try {
        const notebook = await Notebook.findById(req.params.notebookId);
        if (!notebook || notebook.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to delete this notebook' });
        }

        await notebook.remove();
        res.status(200).json({ message: 'Notebook deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting notebook', error: err.message });
    }
};

// Mark a notebook as favorite
exports.favoriteNotebook = async (req, res) => {
    try {
        const notebook = await Notebook.findById(req.params.notebookId);
        if (!notebook || notebook.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to favorite this notebook' });
        }

        notebook.favorite = true;
        const updatedNotebook = await notebook.save();
        res.status(200).json(updatedNotebook);
    } catch (err) {
        res.status(500).json({ message: 'Error marking notebook as favorite', error: err.message });
    }
};

// Unfavorite a notebook
exports.unfavoriteNotebook = async (req, res) => {
    try {
        const notebook = await Notebook.findById(req.params.notebookId);
        if (!notebook || notebook.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to unfavorite this notebook' });
        }

        notebook.favorite = false;
        const updatedNotebook = await notebook.save();
        res.status(200).json(updatedNotebook);
    } catch (err) {
        res.status(500).json({ message: 'Error removing favorite from notebook', error: err.message });
    }
};
