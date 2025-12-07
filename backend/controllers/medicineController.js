import { randomUUID } from 'crypto';
import { getDB } from '../db.js';

export async function createMedicine(req, res) {
  const { medicineCode, medicineName, power, manufacturer, batchNumber, expiryDate, price, description } = req.body;
  // Support both old and new field names
  const code = medicineCode || req.body.code;
  const name = medicineName || req.body.name;
  
  if (!code || !name || !batchNumber || !expiryDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const db = getDB();
  const medicines = db.collection('medicines');
  const existing = await medicines.findOne({ code });
  if (existing) return res.status(409).json({ error: 'Medicine with this code already exists' });

  // Auto-fill manufacturer from profile if role is medicine_company
  let finalManufacturer = manufacturer;
  if (req.user?.role === 'MEDICINE') {
    const users = db.collection('users');
    const user = await users.findOne({ id: req.user.sub });
    finalManufacturer = user?.profile?.companyName || manufacturer || 'Unknown Manufacturer';
  }

  const doc = {
    id: randomUUID(),
    code,
    name,
    power: power || null,
    manufacturer: finalManufacturer,
    batchNumber,
    expiryDate,
    price: price || null,
    description: description || null,
    createdAt: new Date()
  };
  await medicines.insertOne(doc);
  return res.json({ success: true, medicine: doc });
}

export async function verifyMedicine(req, res) {
  const { medicineName, medicineCode } = req.body;
  if (!medicineName && !medicineCode) {
    return res.status(400).json({ error: 'Medicine name or code is required' });
  }
  const db = getDB();
  const medicines = db.collection('medicines');
  const query = medicineCode ? { code: medicineCode } : { name: new RegExp(medicineName, 'i') };
  const med = await medicines.findOne(query);
  if (!med) return res.json({ success: false, message: 'Medicine not found', data: { isAuthentic: false } });
  return res.json({ success: true, message: 'Medicine verified', data: { ...med, isAuthentic: true } });
}

export async function extractMedicineImage(req, res) {
  const { imageData } = req.body;
  if (!imageData) return res.status(400).json({ error: 'imageData is required' });
  const mock = {
    code: 'MED-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
    name: 'AI Extracted Medicine 500mg',
    batchNumber: 'AI-BATCH-' + Math.floor(Math.random() * 10000),
    expiryDate: '2027-12-31',
    manufacturer: 'AI Manufacturer',
    price: '$' + (Math.random() * 40 + 10).toFixed(2)
  };
  return res.json({ success: true, message: 'Image processed (mock)', data: mock });
}
