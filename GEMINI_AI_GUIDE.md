# Gemini AI Integration Guide

## Overview

The ASURE Verification System now integrates **Google Gemini AI** for intelligent document analysis, medicine suggestions, and verification assistance.

## Features

### 1. **Medicine AI Suggestions**

- Personalized medicine recommendations based on patient data
- Age and weight-based dosage calculations
- Drug interaction warnings
- Side effects analysis
- Allergy and condition compatibility checks

### 2. **Certificate Image Analysis**

- Educational certificate OCR and verification
- Tutorial certificate data extraction
- Authenticity assessment (seals, signatures, watermarks)
- Quality scoring and suspicious element detection

### 3. **Medicine Image Analysis**

- Medicine package/label recognition
- Barcode and hologram detection
- Expiry date extraction
- Package condition assessment
- Counterfeit detection indicators

## Setup Instructions

### Step 1: Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 2: Configure Environment

1. Open `server/.env` file
2. Find the `GEMINI_API_KEY` line
3. Replace `your_gemini_api_key_here` with your actual API key:
   ```env
   GEMINI_API_KEY=AIzaSyAbc123...YourActualKey
   ```

### Step 3: Verify Installation

The Gemini AI SDK is already installed. Verify by checking:

```bash
cd server
npm list @google/generative-ai
```

### Step 4: Restart Server

```bash
cd server
node index.js
```

## API Endpoints

### Medicine Suggestion

**POST** `/api/ai/medicine-suggestion`

**Request:**

```json
{
  "medicine": {
    "medicineName": "Napa",
    "medicineCode": "MED-001",
    "manufacturer": "Square Pharma",
    "power": "500mg",
    "genericName": "Paracetamol"
  },
  "patient": {
    "age": "35",
    "weight": "70",
    "conditions": "Diabetes",
    "allergies": "Penicillin",
    "currentMedications": "Metformin"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "suitability": "suitable",
    "dosage": "Take 1-2 tablets every 4-6 hours",
    "timing": "After meals with water",
    "warnings": ["Do not exceed 8 tablets per day"],
    "interactions": ["May interact with alcohol"],
    "sideEffects": ["Nausea", "Dizziness"],
    "recommendations": "Safe for diabetic patients",
    "disclaimer": "Consult a doctor before use"
  }
}
```

### Certificate Image Analysis

**POST** `/api/ai/analyze-certificate`

**Request:**

```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "certificateType": "educational"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "isReadable": true,
    "certificateType": "Bachelor's Degree",
    "extractedData": {
      "studentName": "John Doe",
      "rollNumber": "12345",
      "idNumber": "ABC-2024-001",
      "instituteName": "ABC University",
      "grade": "A+",
      "issueDate": "2024-05-15"
    },
    "authenticity": {
      "hasOfficialSeal": true,
      "hasSignature": true,
      "hasWatermark": true,
      "qualityScore": 95,
      "suspiciousElements": []
    },
    "recommendations": "Certificate appears authentic"
  }
}
```

### Medicine Image Analysis

**POST** `/api/ai/analyze-medicine`

**Request:**

```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "isReadable": true,
    "extractedData": {
      "medicineName": "Napa",
      "medicineCode": "MED-123",
      "manufacturer": "Square Pharma",
      "genericName": "Paracetamol",
      "power": "500mg",
      "batchNumber": "BATCH-2024-001",
      "expiryDate": "2026-12-31",
      "price": "$5.00"
    },
    "packageInfo": {
      "hasBarcode": true,
      "hasHologram": true,
      "conditionAssessment": "Good",
      "suspiciousElements": []
    },
    "recommendations": "Package appears authentic"
  }
}
```

### General AI Assistance

**POST** `/api/ai/assist`

**Request:**

```json
{
  "query": "How do I verify a medicine?",
  "context": {
    "userRole": "PERSONAL"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "response": "To verify a medicine, you can either...",
    "timestamp": "2024-12-01T10:30:00.000Z"
  }
}
```

## Frontend Usage

### Medicine Verification with AI Suggestion

```typescript
// In VerifyMedicine.tsx
const handleGetSuggestion = async (e: React.FormEvent) => {
  const response = await fetch(
    "http://localhost:4000/api/ai/medicine-suggestion",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("asure_token")}`,
      },
      body: JSON.stringify({
        medicine: medicineInfo,
        patient: patientData,
      }),
    }
  );

  const result = await response.json();
  if (result.success) {
    setAiSuggestion(result.data);
  }
};
```

### Certificate Image Analysis

```typescript
// In VerifyEducation.tsx
const handleImageVerification = async () => {
  const reader = new FileReader();
  reader.readAsDataURL(uploadedImage);
  reader.onloadend = async () => {
    const base64Image = reader.result as string;

    const response = await fetch(
      "http://localhost:4000/api/ai/analyze-certificate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("asure_token")}`,
        },
        body: JSON.stringify({
          image: base64Image,
          certificateType: "educational",
        }),
      }
    );

    const aiResult = await response.json();
    // Process results...
  };
};
```

## AI Models Used

- **Gemini 1.5 Flash**: Fast and efficient for real-time analysis
- Supports text and vision (multimodal) inputs
- Optimized for quick responses with high accuracy

## Best Practices

### 1. Image Quality

- Use clear, high-resolution images (minimum 800x600)
- Ensure good lighting and no glare
- Capture full document/package in frame
- Avoid blurry or distorted images

### 2. Patient Data

- Provide complete and accurate information
- Include all relevant medical conditions
- List all current medications
- Specify known allergies

### 3. Error Handling

```typescript
try {
  const response = await fetch(aiEndpoint, options);
  const result = await response.json();

  if (result.success) {
    // Process successful response
  } else {
    console.error("AI Error:", result.message);
  }
} catch (error) {
  console.error("Network Error:", error);
}
```

## Rate Limits & Costs

### Gemini API Free Tier

- **Requests per minute**: 60
- **Requests per day**: 1,500
- **Tokens per minute**: 1,000,000

### Cost Optimization

- Cache repeated queries
- Compress images before sending
- Use appropriate model for task
- Implement request throttling

## Security Considerations

### API Key Protection

- ✅ Store in `.env` file (never commit)
- ✅ Use server-side only (never expose to client)
- ✅ Rotate keys periodically
- ✅ Monitor usage in Google AI Studio

### Data Privacy

- Patient data is NOT stored by Gemini
- Images are processed in-memory only
- All communication uses HTTPS
- JWT authentication required for all endpoints

## Troubleshooting

### Error: "Invalid API Key"

- Verify key in `.env` file
- Check for extra spaces or quotes
- Regenerate key in Google AI Studio

### Error: "Rate Limit Exceeded"

- Wait 60 seconds and retry
- Implement exponential backoff
- Consider upgrading to paid tier

### Error: "Image Too Large"

- Compress image before sending
- Max recommended size: 4MB
- Use JPEG format for photos

### Error: "Invalid Response Format"

- Check if Gemini returned valid JSON
- Verify prompt formatting
- Review console logs for details

## Testing

### Test Medicine Suggestion

```bash
curl -X POST http://localhost:4000/api/ai/medicine-suggestion \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "medicine": {"medicineName": "Napa", "power": "500mg"},
    "patient": {"age": "30", "weight": "65"}
  }'
```

### Test Certificate Analysis

1. Login to the application
2. Go to Verify Education page
3. Upload a certificate image
4. Click "Verify with AI"
5. Review extracted information

## Future Enhancements

- [ ] Multi-language support
- [ ] Voice input for patient data
- [ ] Batch processing for multiple images
- [ ] Advanced fraud detection
- [ ] Integration with medical databases
- [ ] Real-time video analysis

## Support

For issues or questions:

1. Check console logs for detailed errors
2. Verify API key configuration
3. Review request/response formats
4. Contact support with error details

## License

This integration uses Google Gemini API which has its own [Terms of Service](https://ai.google.dev/terms).
