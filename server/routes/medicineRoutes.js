import express from 'express';
import { createMedicine, verifyMedicine, extractMedicineImage } from '../controllers/medicineController.js';

const router = express.Router();

router.post('/new', createMedicine);
router.post('/create', createMedicine); // Add create route alias
router.post('/verify', verifyMedicine);
router.post('/extract', extractMedicineImage);

export default router;
