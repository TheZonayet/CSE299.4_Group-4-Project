import express from 'express';
import { createTutorialCertificate, verifyTutorialCertificate, extractTutorialImage } from '../controllers/tutorialController.js';

const router = express.Router();

router.post('/certificates', createTutorialCertificate);
router.post('/create', createTutorialCertificate); // Add create route alias
router.post('/verify', verifyTutorialCertificate);
router.post('/extract', extractTutorialImage);

export default router;
