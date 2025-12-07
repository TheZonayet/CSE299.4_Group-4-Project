import express from 'express';
import {
  getMedicineSuggestion,
  analyzeCertificateImage,
  analyzeMedicineImage,
  getAIAssistance
} from '../services/geminiService.js';

const router = express.Router();

/**
 * POST /api/ai/medicine-suggestion
 * Get AI suggestion for medicine based on patient data
 */
router.post('/medicine-suggestion', async (req, res) => {
  try {
    const { medicine, patient } = req.body;

    console.log('Medicine suggestion request:', { medicine, patient });

    if (!medicine || !patient) {
      return res.status(400).json({
        success: false,
        message: 'Medicine and patient information are required'
      });
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.error('Gemini API key not configured!');
      return res.status(500).json({
        success: false,
        message: 'AI service not configured. Please contact administrator.',
        error: 'GEMINI_API_KEY not set in environment variables'
      });
    }

    const suggestion = await getMedicineSuggestion(medicine, patient);

    res.json({
      success: true,
      data: suggestion
    });
  } catch (error) {
    console.error('Medicine suggestion error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate medicine suggestion',
      error: error.message
    });
  }
});

/**
 * POST /api/ai/analyze-certificate
 * Analyze certificate image using AI
 */
router.post('/analyze-certificate', async (req, res) => {
  try {
    const { image, certificateType } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Image data is required'
      });
    }

    // detect mime from data URL
    let mimeType = 'image/jpeg';
    const match = /^data:(.+);base64,/.exec(image);
    if (match && match[1]) {
      mimeType = match[1];
    }
    const base64Image = image.replace(/^data:(.+);base64,/, '');

    const analysis = await analyzeCertificateImage(base64Image, certificateType, mimeType);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Certificate analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze certificate',
      error: error.message
    });
  }
});

/**
 * POST /api/ai/analyze-medicine
 * Analyze medicine image using AI
 */
router.post('/analyze-medicine', async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Image data is required'
      });
    }

    let mimeType = 'image/jpeg';
    const match = /^data:(.+);base64,/.exec(image);
    if (match && match[1]) {
      mimeType = match[1];
    }
    const base64Image = image.replace(/^data:(.+);base64,/, '');

    const analysis = await analyzeMedicineImage(base64Image, mimeType);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Medicine analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze medicine image',
      error: error.message
    });
  }
});

/**
 * POST /api/ai/assist
 * Get general AI assistance
 */
router.post('/assist', async (req, res) => {
  try {
    const { query, context } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }

    const assistance = await getAIAssistance(query, context);

    res.json({
      success: true,
      data: assistance
    });
  } catch (error) {
    console.error('AI assistance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI assistance',
      error: error.message
    });
  }
});

export default router;
