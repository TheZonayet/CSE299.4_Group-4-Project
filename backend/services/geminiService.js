import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate medicine suggestion for a patient based on medicine info and patient data
 */
export async function getMedicineSuggestion(medicineInfo, patientData) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a professional medical AI assistant. Analyze the following medicine and patient information, then provide a detailed medical suggestion in plain text format.

Medicine Information:
- Name: ${medicineInfo.medicineName || medicineInfo.name || 'N/A'}
- Code: ${medicineInfo.medicineCode || medicineInfo.code || 'N/A'}
- Manufacturer: ${medicineInfo.manufacturer || 'N/A'}
- Power/Strength: ${medicineInfo.power || 'N/A'}
- Description: ${medicineInfo.description || 'N/A'}
- Generic Name: ${medicineInfo.genericName || 'N/A'}
${medicineInfo.sideEffects ? `- Known Side Effects: ${Array.isArray(medicineInfo.sideEffects) ? medicineInfo.sideEffects.join(', ') : medicineInfo.sideEffects}` : ''}

Patient Information:
- Age: ${patientData.age} years
- Weight: ${patientData.weight} kg
- Medical Conditions: ${patientData.conditions || 'None reported'}
- Known Allergies: ${patientData.allergies || 'None reported'}
- Current Medications: ${patientData.currentMedications || 'None reported'}

Please provide a comprehensive medical analysis in a clear, easy-to-read format covering:
1. Suitability Assessment (Is this medicine suitable/not suitable/requires caution for this patient?)
2. Recommended Dosage (based on age and weight)
3. Timing & Administration (when and how to take)
4. Important Warnings
5. Potential Drug Interactions
6. Possible Side Effects
7. General Recommendations
8. Medical Disclaimer

Provide the response in plain text with clear sections and formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Gemini AI Response:', text);
    
    // Return plain text response
    return {
      suggestion: text,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Gemini AI Error Details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Provide more specific error message
    if (error.message && error.message.includes('API_KEY')) {
      throw new Error('Invalid or missing Gemini API key. Please check your .env file.');
    }
    if (error.message && error.message.includes('quota')) {
      throw new Error('Gemini API quota exceeded. Please try again later.');
    }
    if (error.message && error.message.includes('SAFETY')) {
      throw new Error('Content blocked by safety filters. Please try with different input.');
    }
    
    throw new Error(`Gemini AI Error: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Analyze and verify certificate image using Gemini Vision
 */
export async function analyzeCertificateImage(imageBase64, certificateType = 'educational') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an expert document verification AI. Analyze this ${certificateType} certificate image and extract all visible information.

Please analyze the image and provide a detailed text report covering:

1. READABILITY: Can the certificate be read clearly?
2. CERTIFICATE TYPE: What type of certificate is this?
3. EXTRACTED INFORMATION:
   - Student/Recipient Name
   - Roll Number/ID Number
   - Institution Name
   - Grade/Result
   - Issue Date
   - Certificate ID
   - Course/Program Name
   - Duration
   - Skills/Achievements

4. AUTHENTICITY INDICATORS:
   - Official Seal present?
   - Authorized Signature present?
   - Watermark or security features?
   - Overall quality score (0-100)
   - Any suspicious elements?

5. VERIFICATION RECOMMENDATIONS

Provide the analysis in a clear, easy-to-read text format.`;

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: 'image/jpeg',
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    console.log('Certificate Analysis:', text);
    
    // Return plain text response
    return {
      analysis: text,
      certificateType: certificateType,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Gemini Vision Error:', error);
    throw error;
  }
}

/**
 * Analyze medicine image and extract information
 */
export async function analyzeMedicineImage(imageBase64) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a pharmaceutical AI expert. Analyze this medicine package/label image and extract all visible information.

Please provide a detailed text analysis covering:

1. READABILITY: Can the medicine label/package be read clearly?

2. EXTRACTED INFORMATION:
   - Medicine Name
   - Medicine Code/Product Code
   - Manufacturer Name
   - Generic Name
   - Strength/Power/Dosage
   - Batch Number
   - Expiry Date
   - Price (if visible)

3. PACKAGE ASSESSMENT:
   - Barcode present?
   - Hologram/Security features?
   - Overall condition (Good/Fair/Poor/Damaged)
   - Any suspicious elements or concerns?

4. VERIFICATION RECOMMENDATIONS

Provide the analysis in a clear, easy-to-read text format.`;

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: 'image/jpeg',
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    console.log('Medicine Image Analysis:', text);
    
    // Return plain text response
    return {
      analysis: text,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Gemini Vision Error:', error);
    throw error;
  }
}

/**
 * Get general AI assistance for any query
 */
export async function getAIAssistance(question, context = {}) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a helpful AI assistant for the ASURE verification system. 
    
User Query: ${query}

Context: ${JSON.stringify(context, null, 2)}

Please provide a helpful, accurate, and concise response.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return {
      response: response.text(),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw error;
  }
}
