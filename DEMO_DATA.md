# 🎯 Demo Data Quick Reference

## Test Credentials

### Create a Test User (Registration)

1. Go to http://localhost:5173
2. Click "Register" tab
3. Select role: **Personal** (Student)
4. Fill in:
   - Email: `student@test.com`
   - Password: `password123`
   - Confirm Password: `password123`
5. Click Register
6. Login with the same credentials

---

## 🎓 Educational Certificate Verification

Test these certificates at `/verify-education`:

### Certificate 1

- **Roll Number:** `2020001`
- **Institute ID:** `INST-001`
- **Expected Result:**
  - Student: John Smith
  - Institute: National University (EIIN-123456)
  - Degree: Bachelor of Science in Computer Science
  - CGPA: 3.85
  - Passing Year: 2024

### Certificate 2

- **Roll Number:** `2020002`
- **Institute ID:** `INST-001`
- **Expected Result:**
  - Student: Jane Doe
  - Institute: National University (EIIN-123456)
  - Degree: Bachelor of Engineering
  - CGPA: 3.92
  - Passing Year: 2024

### Certificate 3

- **Roll Number:** `2019050`
- **Institute ID:** `INST-002`
- **Expected Result:**
  - Student: Alice Johnson
  - Institute: Tech Institute (EIIN-789012)
  - Degree: Master of Technology
  - CGPA: 3.75
  - Passing Year: 2023

---

## 💊 Medicine Verification

Test these medicines at `/verify-medicine`:

### Medicine 1 - Paracetamol

- **Medicine Code:** `MED-001`
- **Medicine Name:** `Paracetamol 500mg`
- **Expected Result:**
  - Manufacturer: PharmaCorp International
  - Batch Number: BATCH-2024-1001
  - Expiry Date: 2026-12-31
  - Price: $5.99
  - Description: Pain reliever and fever reducer

**Test Patient Data:**

- Age: 30
- Weight: 70kg
- Medical Conditions: None
- Allergies: None

### Medicine 2 - Amoxicillin

- **Medicine Code:** `MED-002`
- **Medicine Name:** `Amoxicillin 250mg`
- **Expected Result:**
  - Manufacturer: HealthMed Solutions
  - Batch Number: BATCH-2024-2002
  - Expiry Date: 2025-08-15
  - Price: $12.50
  - Description: Antibiotic for bacterial infections

### Medicine 3 - Ibuprofen

- **Medicine Code:** `MED-003`
- **Medicine Name:** `Ibuprofen 400mg`
- **Expected Result:**
  - Manufacturer: MediCare Plus
  - Batch Number: BATCH-2024-3003
  - Expiry Date: 2027-03-20
  - Price: $8.75
  - Description: Anti-inflammatory and pain relief

### Medicine 4 - Vitamin D3

- **Medicine Code:** `MED-004`
- **Medicine Name:** `Vitamin D3 1000IU`
- **Expected Result:**
  - Manufacturer: WellnessLab
  - Batch Number: BATCH-2024-4004
  - Expiry Date: 2026-06-30
  - Price: $15.00
  - Description: Vitamin supplement for bone health

---

## 📦 Product Verification

Test these products at `/verify-product`:

### Product 1 - Wireless Headphones

- **Barcode:** `8901234567890`
- **Expected Result:**
  - Name: Wireless Bluetooth Headphones
  - Manufacturer: AudioTech Inc.
  - Price: $79.99
  - Category: Electronics
  - Description: Premium wireless headphones with noise cancellation

### Product 2 - Green Tea

- **Barcode:** `8901234567891`
- **Expected Result:**
  - Name: Organic Green Tea
  - Manufacturer: Nature's Best
  - Price: $12.99
  - Category: Food & Beverages
  - Description: 100% organic premium green tea

### Product 3 - Fitness Watch

- **Barcode:** `8901234567892`
- **Expected Result:**
  - Name: Smart Fitness Watch
  - Manufacturer: FitTech Corp
  - Price: $149.99
  - Category: Wearables
  - Description: Advanced fitness tracking smartwatch

### Product 4 - Water Bottle

- **Barcode:** `8901234567893`
- **Expected Result:**
  - Name: Eco-Friendly Water Bottle
  - Manufacturer: GreenLife Products
  - Price: $24.99
  - Category: Lifestyle
  - Description: Reusable stainless steel water bottle

---

## 📜 Tutorial Certificate Verification

Test these certificates at `/verify-tutorial`:

### Certificate 1 - Full Stack Development

- **Certificate ID:** `CERT-2024-001`
- **Institute ID:** `TUT-INST-001`
- **Expected Result:**
  - Institute: CodeAcademy Pro (License: LIC-CODE-2020-001)
  - Student: Michael Chen
  - Course: Full Stack Web Development
  - Completion Date: 2024-10-15
  - Duration: 6 months
  - Grade: A+
  - Skills: JavaScript, React, Node.js, MongoDB, Express
  - YouTube Recommendations: Related tutorials

### Certificate 2 - Data Science

- **Certificate ID:** `CERT-2024-002`
- **Institute ID:** `TUT-INST-002`
- **Expected Result:**
  - Institute: Data Science Hub (License: LIC-DATA-2019-002)
  - Student: Sarah Williams
  - Course: Python for Data Science
  - Completion Date: 2024-09-20
  - Duration: 4 months
  - Grade: A
  - Skills: Python, Pandas, NumPy, Machine Learning, TensorFlow

### Certificate 3 - UI/UX Design

- **Certificate ID:** `CERT-2024-003`
- **Institute ID:** `TUT-INST-003`
- **Expected Result:**
  - Institute: Design Masters (License: LIC-DESIGN-2021-003)
  - Student: Emma Davis
  - Course: UI/UX Design Fundamentals
  - Completion Date: 2024-11-01
  - Duration: 3 months
  - Grade: A+
  - Skills: Figma, Adobe XD, User Research, Prototyping, Design Systems

---

## 🧪 Testing Workflow

### Complete Test Flow:

1. **Start Application**

   ```powershell
   .\start.ps1
   ```

2. **Register & Login**

   - Email: `student@test.com`
   - Password: `password123`

3. **Test Educational Verification**

   - Dashboard → "Verify Educational Institute"
   - Manual Entry: Roll `2020001`, Institute `INST-001`
   - Verify → See John Smith's certificate
   - Try Image Upload → Upload any image (mock AI response)

4. **Test Medicine Verification**

   - Dashboard → "Verify Medicines"
   - Search: Code `MED-001` → See Paracetamol
   - Fill Patient Data:
     - Age: 30
     - Weight: 70
     - Conditions: None
     - Allergies: None
   - Get AI Suggestion → See dosage and alternatives

5. **Test Product Verification**

   - Dashboard → "Verify Random Products"
   - Enter Barcode: `8901234567890`
   - Verify → See Wireless Headphones
   - View similar products with pricing

6. **Test Tutorial Verification**
   - Dashboard → "Verify Tutorial Certificate"
   - Enter ID: `CERT-2024-001`
   - Verify → See Full Stack course details
   - View YouTube tutorial recommendations

---

## 📝 Notes

- **All data is seeded in MongoDB** - Ready to test immediately
- **Image uploads work** - Returns mock AI responses for testing
- **Patient suggestions** - AI returns dosage recommendations based on data
- **YouTube links** - Mock recommendations (integrate real YouTube API later)
- **Credits system** - Each user starts with 100 verification credits

---

## 🔄 Reset Demo Data

To reset and reseed the database:

```powershell
cd server
npm run seed
cd ..
```

This will clear and recreate all demo data.

---

## 🎉 Happy Testing!

All verification types are ready to test with real demo data!
