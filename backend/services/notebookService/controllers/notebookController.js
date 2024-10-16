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
