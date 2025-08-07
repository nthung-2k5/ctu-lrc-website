import express from 'express';
import BorrowController from '#controllers/borrow.controller.js';
import { staffOnly } from '#middleware/auth.middleware.js';

const router = express.Router().use(staffOnly);

router.get('/', BorrowController.list);
router.get('/holds', BorrowController.getHoldRequests);
router.post('/holds', BorrowController.acceptHoldRequest);
router.post('/', BorrowController.borrowBook);
router.delete('/', BorrowController.returnBook);

export default router;