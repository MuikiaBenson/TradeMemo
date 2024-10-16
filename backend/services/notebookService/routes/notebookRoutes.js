const express = require('express');
const router = express.Router();
const notebookController = require('../controllers/notebookController');
const auth = require('../middlewares/auth');

// Notebook routes
router.post('/notebooks', auth, notebookController.createNotebook);
router.get('/notebooks', auth, notebookController.getNotebooks);
router.put('/notebooks/:notebookId/rename', auth, notebookController.renameNotebook);
router.delete('/notebooks/:notebookId', auth, notebookController.deleteNotebook);

// Favorite and unfavorite a notebook
router.put('/notebooks/:notebookId/favorite', auth, notebookController.favoriteNotebook);
router.put('/notebooks/:notebookId/unfavorite', auth, notebookController.unfavoriteNotebook);

// Note routes within a notebook
router.post('/notebooks/:notebookId/notes', auth, notebookController.addNote);
router.put('/notebooks/:notebookId/notes/:noteId', auth, notebookController.editNote);
router.delete('/notebooks/:notebookId/notes/:noteId', auth, notebookController.deleteNote);

module.exports = router;
