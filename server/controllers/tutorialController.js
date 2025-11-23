import { randomUUID } from 'crypto';
import { getDB } from '../db.js';

export async function createTutorialCertificate(req, res) {
  const { certificateId, instituteId, instituteName, student, course, completionDate, duration, grade, skillsAchieved } = req.body;
  // Support both old and new field names
  const studentName = student || req.body.studentName;
  const courseName = course || req.body.courseName;
  const skills = skillsAchieved || req.body.skills || [];
  
  if (!certificateId || !instituteId || !studentName || !courseName || !completionDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const db = getDB();
  const certs = db.collection('tutorial_certificates');
  const institutes = db.collection('tutorial_institutes');
  const existing = await certs.findOne({ certificateId });
  if (existing) return res.status(409).json({ error: 'Certificate ID already exists' });

  const institute = await institutes.findOne({ instituteId });
  const doc = {
    id: randomUUID(),
    certificateId,
    instituteId,
    instituteName: instituteName || institute?.instituteName || 'Unknown Tutorial Institute',
    studentName,
    courseName,
    completionDate,
    duration: duration || null,
    grade: grade || null,
    skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
    createdAt: new Date()
  };
  await certs.insertOne(doc);
  return res.json({ success: true, certificate: doc });
}

export async function verifyTutorialCertificate(req, res) {
  const { certificateId } = req.body;
  if (!certificateId) return res.status(400).json({ error: 'Certificate ID is required' });
  const db = getDB();
  const certs = db.collection('tutorial_certificates');
  const cert = await certs.findOne({ certificateId });
  if (!cert) return res.json({ success: false, message: 'Tutorial certificate not found', data: { isAuthentic: false } });
  return res.json({ success: true, message: 'Tutorial certificate verified', data: { ...cert, isAuthentic: true } });
}

export async function extractTutorialImage(req, res) {
  const { imageData } = req.body;
  if (!imageData) return res.status(400).json({ error: 'imageData is required' });
  const mockSkills = ['JavaScript', 'React', 'Node.js', 'MongoDB'];
  const mock = {
    certificateId: 'CERT-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
    instituteId: 'TUT-INST-001',
    studentName: 'AI Extracted Student',
    courseName: 'Full Stack Development',
    completionDate: '2024-12-01',
    duration: '6 months',
    grade: 'A',
    skills: mockSkills,
    youtubeRecommendations: mockSkills.slice(0,2).map(s => ({ title: `${s} Crash Course`, channel: 'AI Tutor', url: 'https://youtube.com/watch?v=demo' + Math.floor(Math.random()*1000) }))
  };
  return res.json({ success: true, message: 'Image processed (mock)', data: mock });
}
