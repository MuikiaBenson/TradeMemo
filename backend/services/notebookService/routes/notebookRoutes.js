const express = require('express');
const router = express.Router();
const notebookController = require('../controllers/notebookController');
const auth = require('../middlewares/auth');

// Notebook routes
router.post('/notebooks', auth, notebookController.createNotebook);
router.get('/notebooks', auth, notebookController.getNotebooks);
router.put('/notebooks/:notebookId/rename', auth, notebookController.renameNotebook);
router.delete('/notebooks/:notebookId', auth, notebookController.deleteNotebook);
