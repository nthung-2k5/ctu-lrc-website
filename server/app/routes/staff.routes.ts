import express from 'express';
import StaffController from '#controllers/staff.controller.js';
import { adminOnly } from '#middleware/auth.middleware.js';

const router = express.Router();
router.get('/profile', (req, res, next) => {
    if (!req.user || !req.user.isStaff) {
        res.sendStatus(204);
        return;
    }

    req.params.id = req.user.id.toString(); // Ensure req.params.id is set for profile update
    next();
}, StaffController.find);

router.use(adminOnly);

router.get('/', StaffController.list);
router.get('/:id', StaffController.find);
router.post('/', StaffController.create);
router.put('/:id', StaffController.update);
router.delete('/:id', StaffController.delete);

export default router;
