import { randomUUID } from 'crypto';
import { getDB } from '../db-mysql.js';
import { consumeCreditAndLog } from '../helpers/creditsHelper.js';

export async function createTutorialCertificate(req, res) {
  console.log('📝 Received tutorial certificate data:', JSON.stringify(req.body, null, 2));
  
  const { certificateId, instituteId, instituteName, student, course, completionDate, duration, grade, skillsAchieved } = req.body;
  const studentName = student || req.body.studentName;
  const courseName = course || req.body.courseName;
  const skills = skillsAchieved || req.body.skills || [];
  
  console.log('🔍 Validation check:', {
    certificateId: !!certificateId,
    instituteId: !!instituteId,
    studentName: !!studentName,
    courseName: !!courseName,
    completionDate: !!completionDate
  });
  
  if (!certificateId || !instituteId || !studentName || !courseName || !completionDate) {
    console.log('❌ Missing fields. Values:', {
      certificateId,
      instituteId,
      studentName,
      courseName,
      completionDate
    });
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const pool = getDB();
  
  try {
    const [existing] = await pool.execute(
      'SELECT * FROM tutorial_certificates WHERE certificate_id = ?',
      [certificateId]
    );
    
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Certificate ID already exists' });
    }

    const [institutes] = await pool.execute(
      'SELECT * FROM tutorial_profiles WHERE institute_id = ?',
      [instituteId]
    );
    
    const institute = institutes[0];
    const id = randomUUID();
    const skillsText = Array.isArray(skills) ? skills.join(',') : (skills ? skills : '');
    
    const doc = {
      id,
      certificateId,
      instituteId,
      instituteName: instituteName || institute?.institute_name || 'Unknown Tutorial Institute',
      studentName,
      courseName,
      completionDate,
      duration: duration || null,
      grade: grade || null,
      skills: skillsText
    };
    
    await pool.execute(
      'INSERT INTO tutorial_certificates (id, certificate_id, institute_id, institute_name, student_name, course_name, completion_date, duration, grade, skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, certificateId, instituteId, doc.instituteName, studentName, courseName, completionDate, duration, grade, skillsText]
    );
    
    return res.json({ success: true, certificate: doc });
  } catch (error) {
    console.error('Error creating tutorial certificate:', error);
    return res.status(500).json({ error: 'Failed to create tutorial certificate' });
  }
}

export async function verifyTutorialCertificate(req, res) {
  const { certificateId } = req.body;
  if (!certificateId) return res.status(400).json({ error: 'Certificate ID is required' });
  const pool = getDB();
  
  try {
    const [certificates] = await pool.execute(
      'SELECT * FROM tutorial_certificates WHERE certificate_id = ?',
      [certificateId]
    );
    
    if (certificates.length === 0) {
      return res.json({ success: false, message: 'Tutorial certificate not found', data: { isAuthentic: false } });
    }
    
    const cert = certificates[0];
    const data = {
      certificateId: cert.certificate_id,
      instituteId: cert.institute_id,
      instituteName: cert.institute_name,
      studentName: cert.student_name,
      courseName: cert.course_name,
      completionDate: cert.completion_date,
      duration: cert.duration,
      grade: cert.grade,
      skills: cert.skills ? cert.skills.split(',') : [],
      isAuthentic: true
    };

    await consumeCreditAndLog(req.user.sub, 'TUTORIAL', cert.certificate_id || certificateId);
    
    return res.json({ success: true, message: 'Tutorial certificate verified', data });
  } catch (error) {
    console.error('Error verifying tutorial certificate:', error);
    if (error.status === 403) return res.status(403).json({ error: error.message });
    return res.status(500).json({ error: 'Failed to verify tutorial certificate' });
  }
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
