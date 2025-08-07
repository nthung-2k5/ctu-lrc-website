import express from 'express';
import PublisherController from '#controllers/publisher.controller.js';
import { staffOnly } from '#middleware/auth.middleware.js';

const router = express.Router();

router.get('/', PublisherController.list);

router.get('/:id', staffOnly, PublisherController.find);
router.post('/', staffOnly, PublisherController.create);
router.put('/:id', staffOnly, PublisherController.update);
router.delete('/:id', staffOnly, PublisherController.delete);

export default router;
