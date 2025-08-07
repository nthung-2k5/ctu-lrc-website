import express from 'express';
import ReaderController from '#controllers/reader.controller.js';
import { readerOnly, staffOnly } from '#middleware/auth.middleware.js';

const router = express.Router();
router.post('/', ReaderController.create);
router.get('/profile', (req, res, next) => {
    if (!req.user || !req.user.isReader) {
        res.sendStatus(204);
        return;
    }

    req.params.id = req.user.id.toString();
    next();
}, ReaderController.find);

router.post('/profile', readerOnly, (req, _, next) => {
    req.params.id = req.user!.id.toString();
    next();
}, ReaderController.update);

router.get('/borrows', readerOnly, ReaderController.getBorrowHistory);

router.get('/holds', readerOnly, ReaderController.getHolds);
router.get('/holds/:bookId', readerOnly, ReaderController.checkHold);
router.post('/holds/:bookId', readerOnly, ReaderController.holdBook);
router.delete('/holds/:bookId', readerOnly, ReaderController.cancelHold);


// Protected routes
router.get('/', staffOnly, ReaderController.list);
router.get('/:id', staffOnly, ReaderController.find);
router.put('/:id', staffOnly, ReaderController.update);
router.delete('/:id', staffOnly, ReaderController.delete);

export default router;
