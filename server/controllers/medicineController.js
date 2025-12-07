import { randomUUID } from 'crypto';
import { getDB } from '../db-mysql.js';
import { consumeCreditAndLog } from '../helpers/creditsHelper.js';

export async function createMedicine(req, res) {
  const { medicineCode, medicineName, power, manufacturer, batchNumber, expiryDate, price, description } = req.body;
  const code = medicineCode || req.body.code;
  const name = medicineName || req.body.name;
  
  if (!code || !name || !batchNumber || !expiryDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const pool = getDB();
  
  try {
    const [existing] = await pool.execute(
      'SELECT * FROM medicines WHERE medicine_code = ?',
      [code]
    );
    
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Medicine with this code already exists' });
    }

    let finalManufacturer = manufacturer;
    if (req.user?.role === 'MEDICINE') {
      const [profiles] = await pool.execute(
        'SELECT company_name FROM medicine_profiles WHERE user_id = ?',
        [req.user.sub]
      );
      if (profiles.length > 0) {
        finalManufacturer = profiles[0].company_name || manufacturer || 'Unknown Manufacturer';
      }
    }

    const id = randomUUID();
    const doc = {
      id,
      code,
      name,
      power: power || null,
      manufacturer: finalManufacturer,
      batchNumber,
      expiryDate,
      price: price || null,
      description: description || null
    };
    
    await pool.execute(
      'INSERT INTO medicines (id, medicine_code, medicine_name, power, manufacturer, batch_number, expiry_date, price, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, code, name, power, finalManufacturer, batchNumber, expiryDate, price, description]
    );
    
    return res.json({ success: true, medicine: doc });
  } catch (error) {
    console.error('Error creating medicine:', error);
    return res.status(500).json({ error: 'Failed to create medicine' });
  }
}

export async function verifyMedicine(req, res) {
  const { medicineName, medicineCode } = req.body;
  if (!medicineName && !medicineCode) {
    return res.status(400).json({ error: 'Medicine name or code is required' });
  }
  const pool = getDB();
  
  try {
    let medicines;
    if (medicineCode) {
      [medicines] = await pool.execute(
        'SELECT * FROM medicines WHERE medicine_code = ?',
        [medicineCode]
      );
    } else {
      [medicines] = await pool.execute(
        'SELECT * FROM medicines WHERE medicine_name LIKE ?',
        [`%${medicineName}%`]
      );
    }
    
    if (medicines.length === 0) {
      return res.json({ success: false, message: 'Medicine not found', data: { isAuthentic: false } });
    }
    
    const med = medicines[0];
    const data = {
      code: med.medicine_code,
      name: med.medicine_name,
      power: med.power,
      manufacturer: med.manufacturer,
      batchNumber: med.batch_number,
      expiryDate: med.expiry_date,
      price: med.price,
      description: med.description,
      isAuthentic: true
    };
    await consumeCreditAndLog(req.user.sub, 'MEDICINE', med.medicine_code || medicineCode || medicineName);
    return res.json({ success: true, message: 'Medicine verified', data });
  } catch (error) {
    console.error('Error verifying medicine:', error);
    if (error.status === 403) return res.status(403).json({ error: error.message });
    return res.status(500).json({ error: 'Failed to verify medicine' });
  }
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
