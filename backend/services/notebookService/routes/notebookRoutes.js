const express = require('express');
const router = express.Router();
const notebookController = require('../controllers/notebookController');
const auth = require('../middlewares/auth'); // Ensure you have this middleware implemented

// Notebook routes
router.post('/notebooks', auth, notebookController.createNotebook); // Create a notebook
router.get('/notebooks', auth, notebookController.getNotebooks); // Get all notebooks
router.put('/notebooks/:notebookId/rename', auth, notebookController.renameNotebook); // Rename a notebook
router.delete('/notebooks/:notebookId', auth, notebookController.deleteNotebook); // Delete a notebook

// Favorite and unfavorite a notebook
router.put('/notebooks/:notebookId/favorite', auth, notebookController.favoriteNotebook); // Mark notebook as favorite
router.put('/notebooks/:notebookId/unfavorite', auth, notebookController.unfavoriteNotebook); // Unmark notebook as favorite

// Note routes within a notebook
router.post('/notebooks/:notebookId/notes', auth, notebookController.addNote); // Add a note to a notebook
router.put('/notebooks/:notebookId/notes/:noteId', auth, notebookController.editNote); // Edit a note
router.delete('/notebooks/:notebookId/notes/:noteId', auth, notebookController.deleteNote); // Delete a note

module.exports = router;

