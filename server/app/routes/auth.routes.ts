import express from 'express';
import * as AuthenticationController from '#controllers/auth.controller.js';

const router = express.Router();

router.post('/staff', AuthenticationController.loginStaff);
router.post('/reader', AuthenticationController.loginReader);

router.post('/logout', AuthenticationController.logout);

export default router;
