const express = require('express');
const router = express.Router();
const notebookController = require('../controllers/notebookController');
const auth = require('../middlewares/auth');

// Notebook routes
router.post('/', auth, notebookController.createNotebook); // Create a notebook
router.get('/', auth, notebookController.getNotebooks); // Get all notebooks
router.put('/:notebookId/rename', auth, notebookController.renameNotebook); // Rename a notebook
router.delete('/:notebookId', auth, notebookController.deleteNotebook); // Delete a notebook

// Favorite and unfavorite a notebook
router.put('/:notebookId/favorite', auth, notebookController.favoriteNotebook); // Mark notebook as favorite
router.put('/:notebookId/unfavorite', auth, notebookController.unfavoriteNotebook); // Unmark notebook as favorite

// Note routes within a notebook
router.post('/:notebookId/notes', auth, notebookController.addNote); // Add a note to a notebook
router.put('/:notebookId/notes/:noteId', auth, notebookController.editNote); // Edit a note
router.delete('/:notebookId/notes/:noteId', auth, notebookController.deleteNote); // Delete a note

module.exports = router;

