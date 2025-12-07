import axios from 'axios';
import { getDB } from '../db-mysql.js';
import { consumeCreditAndLog } from '../helpers/creditsHelper.js';

export async function verifyProduct(req, res) {
  const { barcode } = req.body;
  if (!barcode) return res.status(400).json({ error: 'Barcode is required' });
  const pool = getDB();
  
  try {
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE product_code = ?',
      [barcode]
    );
    
    if (products.length === 0) {
      return res.json({ success: false, message: 'Product not found', data: { isAuthentic: false } });
    }
    
    const product = products[0];
    const data = {
      barcode: product.product_code,
      name: product.product_name,
      manufacturer: product.manufacturer,
      batchNumber: product.batch_number,
      manufacturingDate: product.manufacturing_date,
      expiryDate: product.expiry_date,
      description: product.description,
      isAuthentic: true
    };

    await consumeCreditAndLog(req.user.sub, 'PRODUCT', product.product_code || barcode);
    
    return res.json({ success: true, message: 'Product verified', data });
  } catch (error) {
    console.error('Error verifying product:', error);
    if (error.status === 403) return res.status(403).json({ error: error.message });
    return res.status(500).json({ error: 'Failed to verify product' });
  }
}

export async function lookupBarcode(req, res) {
  const { barcode } = req.query;
  if (!barcode) return res.status(400).json({ error: 'barcode query param required' });
  const apiKey = process.env.BARCODE_LOOKUP_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });
  try {
    const url = `https://api.barcodelookup.com/v3/products?barcode=${encodeURIComponent(barcode)}&formatted=y&key=${apiKey}`;
    const response = await axios.get(url, { timeout: 8000 });
    const products = response.data?.products || [];
    if (!products.length) return res.json({ success: false, message: 'No products found', data: [] });
    const mapped = products.map(p => ({
      name: p.product_name,
      manufacturer: p.manufacturer,
      barcode: p.barcode_number,
      description: p.description,
      images: p.images,
      category: p.category,
      price: p.list_price
    }));
    return res.json({ success: true, data: mapped });
  } catch (e) {
    return res.status(502).json({ error: 'Lookup failed', details: e.message });
  }
}

export async function extractProductImage(req, res) {
  const { imageData } = req.body;
  if (!imageData) return res.status(400).json({ error: 'imageData is required' });
  const mock = {
    barcode: '8901234567' + Math.floor(Math.random() * 100),
    name: 'AI Extracted Product',
    manufacturer: 'AI Manufacturer',
    price: '$' + (Math.random() * 120 + 10).toFixed(2),
    category: 'Mock Category'
  };
  return res.json({ success: true, message: 'Image processed (mock)', data: mock });
}
