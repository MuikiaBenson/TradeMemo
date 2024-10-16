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
