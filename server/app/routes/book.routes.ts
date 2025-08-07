import express from 'express';
import BookController from '#controllers/book.controller.js';
import { staffOnly } from '#middleware/auth.middleware.js';

const router = express.Router();

router.get('/', BookController.list);
router.get('/search', BookController.search);
router.get('/genres', BookController.listGenres);
router.get('/:id', BookController.find);

router.post('/', staffOnly, BookController.create);
router.put('/:id', staffOnly, BookController.update);
router.delete('/:id', staffOnly, BookController.delete);

export default router;
