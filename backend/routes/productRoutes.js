import express from 'express';
import { verifyProduct, lookupBarcode, extractProductImage } from '../controllers/productController.js';

const router = express.Router();

router.post('/verify', verifyProduct);
router.get('/lookup', lookupBarcode);
router.post('/extract', extractProductImage);

export default router;
