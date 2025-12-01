# API Integration Reference - Gemini AI

Quick reference for developers integrating with the Gemini AI features.

## 🔑 Authentication

All AI endpoints require JWT authentication:

```javascript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('asure_token')}`
}
```

## 📍 Endpoints

### 1. Medicine AI Suggestion

**Endpoint:** `POST http://localhost:4000/api/ai/medicine-suggestion`

**Purpose:** Get personalized medicine recommendations based on patient profile

**Request Body:**

```javascript
{
  "medicine": {
    "medicineName": "Napa",
    "medicineCode": "MED-001",
    "manufacturer": "Square Pharma",
    "power": "500mg",
    "genericName": "Paracetamol",
    "description": "Pain reliever and fever reducer"
  },
  "patient": {
    "age": "35",
    "weight": "70",
    "conditions": "Diabetes, Hypertension",
    "allergies": "Penicillin",
    "currentMedications": "Metformin, Lisinopril"
  }
}
```

**Response:**

```javascript
{
  "success": true,
  "data": {
    "suitability": "suitable",  // or "not_suitable" or "caution_required"
    "dosage": "Take 1-2 tablets every 4-6 hours as needed",
    "timing": "After meals with a full glass of water",
    "warnings": [
      "Do not exceed 8 tablets in 24 hours",
      "Avoid alcohol consumption"
    ],
    "interactions": [
      "May enhance effects of warfarin",
      "Monitor blood sugar levels when taking with diabetes medications"
    ],
    "sideEffects": [
      "Nausea (rare)",
      "Allergic reactions (rare)",
      "Liver problems with overdose"
    ],
    "recommendations": "Safe for diabetic patients when used as directed. Monitor liver function with long-term use.",
    "disclaimer": "This is AI-generated advice. Consult a healthcare professional before taking any medication."
  }
}
```

**Frontend Usage:**

```typescript
const getSuggestion = async () => {
  const response = await fetch(
    "http://localhost:4000/api/ai/medicine-suggestion",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("asure_token")}`,
      },
      body: JSON.stringify({ medicine, patient }),
    }
  );

  const result = await response.json();
  if (result.success) {
    console.log("Suitability:", result.data.suitability);
    console.log("Dosage:", result.data.dosage);
  }
};
```

---

### 2. Certificate Image Analysis

**Endpoint:** `POST http://localhost:4000/api/ai/analyze-certificate`

**Purpose:** Extract data from certificate images using AI OCR

**Request Body:**

```javascript
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",  // base64 encoded
  "certificateType": "educational"  // or "tutorial"
}
```

**Response:**

```javascript
{
  "success": true,
  "data": {
    "isReadable": true,
    "certificateType": "Bachelor of Science",
    "extractedData": {
      "studentName": "John Doe",
      "rollNumber": "12345",
      "idNumber": "ABC-2024-001",
      "instituteName": "ABC University",
      "grade": "A+",
      "issueDate": "2024-05-15",
      "certificateId": "CERT-2024-12345",
      "courseName": "Computer Science",
      "duration": "4 years",
      "skills": ["Programming", "Database Design", "Web Development"]
    },
    "authenticity": {
      "hasOfficialSeal": true,
      "hasSignature": true,
      "hasWatermark": true,
      "qualityScore": 95,
      "suspiciousElements": []
    },
    "recommendations": "Certificate appears authentic with all security features present."
  }
}
```

**Frontend Usage:**

```typescript
const analyzeCertificate = async (file: File) => {
  // Convert to base64
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = async () => {
    const base64 = reader.result as string;

    const response = await fetch(
      "http://localhost:4000/api/ai/analyze-certificate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("asure_token")}`,
        },
        body: JSON.stringify({
          image: base64,
          certificateType: "educational",
        }),
      }
    );

    const result = await response.json();
    if (result.success && result.data.isReadable) {
      console.log("Student:", result.data.extractedData.studentName);
      console.log("Grade:", result.data.extractedData.grade);
      console.log("Quality:", result.data.authenticity.qualityScore);
    }
  };
};
```

---

### 3. Medicine Image Analysis

**Endpoint:** `POST http://localhost:4000/api/ai/analyze-medicine`

**Purpose:** Scan medicine packages and extract information

**Request Body:**

```javascript
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."  // base64 encoded
}
```

**Response:**

```javascript
{
  "success": true,
  "data": {
    "isReadable": true,
    "extractedData": {
      "medicineName": "Napa",
      "medicineCode": "MED-123",
      "manufacturer": "Square Pharmaceuticals Ltd.",
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
    "recommendations": "Package appears authentic. All security features are present and intact."
  }
}
```

**Frontend Usage:**

```typescript
const analyzeMedicine = async (file: File) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = async () => {
    const base64 = reader.result as string;

    const response = await fetch(
      "http://localhost:4000/api/ai/analyze-medicine",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("asure_token")}`,
        },
        body: JSON.stringify({ image: base64 }),
      }
    );

    const result = await response.json();
    if (result.success && result.data.isReadable) {
      console.log("Medicine:", result.data.extractedData.medicineName);
      console.log("Expiry:", result.data.extractedData.expiryDate);
      console.log("Condition:", result.data.packageInfo.conditionAssessment);
    }
  };
};
```

---

### 4. General AI Assistance

**Endpoint:** `POST http://localhost:4000/api/ai/assist`

**Purpose:** Get AI help for general queries

**Request Body:**

```javascript
{
  "query": "How do I verify a medicine?",
  "context": {
    "userRole": "PERSONAL",
    "currentPage": "home"
  }
}
```

**Response:**

```javascript
{
  "success": true,
  "data": {
    "response": "To verify a medicine, you can:\n1. Go to the Medicine Verification page\n2. Either search by medicine name/code or upload a photo\n3. The system will check authenticity and provide details\n4. You can also get AI suggestions for patient-specific advice",
    "timestamp": "2024-12-01T10:30:00.000Z"
  }
}
```

---

## 🔧 Error Handling

### Common Error Responses

**Invalid API Key:**

```javascript
{
  "success": false,
  "message": "Failed to generate medicine suggestion",
  "error": "API key not valid"
}
```

**Rate Limit Exceeded:**

```javascript
{
  "success": false,
  "message": "Failed to analyze certificate",
  "error": "Rate limit exceeded. Please try again later."
}
```

**Invalid Image:**

```javascript
{
  "success": false,
  "message": "Failed to analyze medicine image",
  "error": "Image data is required"
}
```

### Error Handling Pattern

```typescript
try {
  const response = await fetch(endpoint, options);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Request failed");
  }

  if (result.success) {
    // Handle success
    return result.data;
  } else {
    // Handle API-level error
    console.error("API Error:", result.message);
    return null;
  }
} catch (error) {
  // Handle network/parse errors
  console.error("Network Error:", error);
  return null;
}
```

---

## 📊 Response Time Expectations

| Endpoint             | Average Response Time |
| -------------------- | --------------------- |
| Medicine Suggestion  | 2-4 seconds           |
| Certificate Analysis | 3-5 seconds           |
| Medicine Analysis    | 2-4 seconds           |
| General Assistance   | 1-2 seconds           |

---

## 🔒 Security Best Practices

1. **Never expose API key in frontend code**

   ```javascript
   // ❌ WRONG
   const GEMINI_KEY = "AIzaSy...";

   // ✅ CORRECT - Key stays on server
   // Frontend only calls backend API
   ```

2. **Always validate JWT token**

   ```javascript
   // Server-side middleware validates token
   app.use("/api/ai", authMiddleware, aiRoutes);
   ```

3. **Sanitize user inputs**

   ```javascript
   // Server validates request body
   if (!medicine || !patient) {
     return res.status(400).json({
       success: false,
       message: "Required fields missing",
     });
   }
   ```

4. **Implement rate limiting**
   ```javascript
   // Future enhancement - add rate limiting per user
   // Example: Max 10 AI requests per minute per user
   ```

---

## 🧪 Testing Examples

### Test with cURL

**Medicine Suggestion:**

```bash
curl -X POST http://localhost:4000/api/ai/medicine-suggestion \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "medicine": {"medicineName": "Napa", "power": "500mg"},
    "patient": {"age": "30", "weight": "65"}
  }'
```

**Certificate Analysis:**

```bash
curl -X POST http://localhost:4000/api/ai/analyze-certificate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "image": "data:image/jpeg;base64,...",
    "certificateType": "educational"
  }'
```

---

## 📚 Additional Resources

- **Gemini API Docs**: https://ai.google.dev/docs
- **Complete Guide**: [GEMINI_AI_GUIDE.md](GEMINI_AI_GUIDE.md)
- **Quick Start**: [QUICKSTART_AI.md](QUICKSTART_AI.md)
- **Integration Summary**: [GEMINI_INTEGRATION_SUMMARY.md](GEMINI_INTEGRATION_SUMMARY.md)

---

## 🆘 Support

For integration issues:

1. Check browser console (F12)
2. Check server logs
3. Verify API key configuration
4. Review this reference guide
5. Contact development team

---

**Last Updated**: December 1, 2025
**API Version**: 1.0.0
**Gemini Model**: gemini-1.5-flash
