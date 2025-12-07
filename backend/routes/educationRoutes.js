import express from 'express';
import { createCertificate, verifyCertificate, extractCertificateImage } from '../controllers/educationController.js';

const router = express.Router();

router.post('/certificates', createCertificate);
router.post('/create', createCertificate); // Add create route alias
router.post('/verify', verifyCertificate);
router.post('/extract', extractCertificateImage);

export default router;
