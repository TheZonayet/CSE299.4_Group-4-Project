import { randomUUID } from 'crypto';
import { getDB } from '../db-mysql.js';
import { consumeCreditAndLog } from '../helpers/creditsHelper.js';

export async function createCertificate(req, res) {
  const { rollNumber, instituteId, studentName, degree, cgpa, passingYear, department } = req.body;
  if (!rollNumber || !instituteId || !studentName || !degree || !cgpa || !passingYear) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const pool = getDB();
  
  try {
    const [existing] = await pool.execute(
      'SELECT * FROM educational_certificates WHERE roll_number = ? AND institute_id = ?',
      [rollNumber, instituteId]
    );
    
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Certificate already exists for this roll & institute.' });
    }

    const [institutes] = await pool.execute(
      'SELECT * FROM educational_profiles WHERE institute_id = ?',
      [instituteId]
    );
    
    const institute = institutes[0];
    const id = randomUUID();
    const doc = {
      id,
      rollNumber,
      instituteId,
      instituteName: institute?.institute_name || req.body.instituteName || 'Unknown Institute',
      eiinNumber: institute?.eiin_number || req.body.eiinNumber || null,
      studentName,
      degree,
      department: department || null,
      cgpa,
      passingYear
    };
    
    await pool.execute(
      'INSERT INTO educational_certificates (id, roll_number, institute_id, institute_name, eiin_number, student_name, degree, department, cgpa, passing_year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, rollNumber, instituteId, doc.instituteName, doc.eiinNumber, studentName, degree, department, cgpa, passingYear]
    );
    
    return res.json({ success: true, certificate: doc });
  } catch (error) {
    console.error('Error creating certificate:', error);
    return res.status(500).json({ error: 'Failed to create certificate' });
  }
}

export async function verifyCertificate(req, res) {
  const { rollNumber, instituteId, idNumber } = req.body;
  if (!rollNumber) {
    return res.status(400).json({ error: 'Roll number is required' });
  }

  const pool = getDB();
  
  try {
    let certificates;
    
    // Try to verify by roll_number + id_number first
    if (idNumber) {
      [certificates] = await pool.execute(
        'SELECT * FROM educational_certificates WHERE roll_number = ? AND id_number = ?',
        [rollNumber, idNumber]
      );
    }
    
    // Fallback to roll_number + institute_id if no match or if only instituteId provided
    if ((!certificates || certificates.length === 0) && instituteId) {
      [certificates] = await pool.execute(
        'SELECT * FROM educational_certificates WHERE roll_number = ? AND institute_id = ?',
        [rollNumber, instituteId]
      );
    }

    // Final fallback: roll number only (help users who only know roll)
    if ((!certificates || certificates.length === 0)) {
      [certificates] = await pool.execute(
        'SELECT * FROM educational_certificates WHERE roll_number = ?',
        [rollNumber]
      );
    }
    
    if (!certificates || certificates.length === 0) {
      return res.json({ success: false, message: 'Certificate not found', data: { isAuthentic: false } });
    }
    
    const cert = certificates[0];
    const data = {
      rollNumber: cert.roll_number,
      idNumber: cert.id_number,
      instituteId: cert.institute_id,
      instituteName: cert.institute_name,
      eiinNumber: cert.eiin_number,
      studentName: cert.student_name,
      degree: cert.degree,
      department: cert.department,
      cgpa: cert.cgpa,
      passingYear: cert.passing_year,
      isAuthentic: true
    };

    // Deduct credit and log history
    await consumeCreditAndLog(req.user.sub, 'EDUCATION', rollNumber || cert.roll_number);
    
    return res.json({ success: true, message: 'Certificate verified', data });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    if (error.status === 403) return res.status(403).json({ error: error.message });
    return res.status(500).json({ error: 'Failed to verify certificate' });
  }
}

export async function extractCertificateImage(req, res) {
  // Placeholder AI OCR logic; expects base64 image in imageData
  const { imageData } = req.body;
  if (!imageData) return res.status(400).json({ error: 'imageData is required' });
  const mock = {
    rollNumber: 'AI-' + Math.floor(Math.random() * 10000),
    instituteId: 'INST-001',
    studentName: 'AI Extracted Student',
    degree: 'Bachelor of Science',
    department: 'Computer Science',
    cgpa: '3.90',
    passingYear: '2024'
  };
  return res.json({ success: true, message: 'Image processed (mock)', data: mock });
}
