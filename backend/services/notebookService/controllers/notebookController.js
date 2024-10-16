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

