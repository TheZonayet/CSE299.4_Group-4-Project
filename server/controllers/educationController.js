import { randomUUID } from 'crypto';
import { getDB } from '../db.js';

export async function createCertificate(req, res) {
  const { rollNumber, instituteId, studentName, degree, cgpa, passingYear, department } = req.body;
  if (!rollNumber || !instituteId || !studentName || !degree || !cgpa || !passingYear) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const db = getDB();
  const certificates = db.collection('educational_certificates');
  const institutes = db.collection('educational_institutes');

  const existing = await certificates.findOne({ rollNumber, instituteId });
  if (existing) {
    return res.status(409).json({ error: 'Certificate already exists for this roll & institute.' });
  }

  const institute = await institutes.findOne({ instituteId });
  const doc = {
    id: randomUUID(),
    rollNumber,
    instituteId,
    instituteName: institute?.instituteName || req.body.instituteName || 'Unknown Institute',
    eiinNumber: institute?.eiinNumber || req.body.eiinNumber || null,
    studentName,
    degree,
    department: department || null,
    cgpa,
    passingYear,
    createdAt: new Date()
  };
  await certificates.insertOne(doc);
  return res.json({ success: true, certificate: doc });
}

export async function verifyCertificate(req, res) {
  const { rollNumber, instituteId } = req.body;
  if (!rollNumber || !instituteId) {
    return res.status(400).json({ error: 'Roll number and institute ID are required' });
  }
  const db = getDB();
  const certificates = db.collection('educational_certificates');
  const cert = await certificates.findOne({ rollNumber, instituteId });
  if (!cert) return res.json({ success: false, message: 'Certificate not found', data: { isAuthentic: false } });
  return res.json({ success: true, message: 'Certificate verified', data: { ...cert, isAuthentic: true } });
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
