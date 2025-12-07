# Education Certificate Verification Fix

## Problem

The verification form asks for "Roll Number" and "ID Number", but:

- Database has both `id_number` (student ID) and `institute_id` fields
- Backend only checks `rollNumber` + `instituteId`
- Your certificate (Roll: 1234) has `id_number = null` and `institute_id = "UNKNOWN"`

## Quick Solutions

### Option 1: Update Your Certificate Data

```sql
UPDATE educational_certificates
SET id_number = '244113'
WHERE roll_number = '1234';
```

### Option 2: Verify with Institute ID

Instead of ID Number `244113`, enter Institute ID: `UNKNOWN`

### Option 3: Fix Backend (Recommended)

Update `server/controllers/educationController.js` line 54-85 to support both verification methods.

## Backend Fix Code

Replace the `verifyCertificate` function with:

```javascript
export async function verifyCertificate(req, res) {
  const { rollNumber, instituteId, idNumber } = req.body;
  if (!rollNumber) {
    return res.status(400).json({ error: "Roll number is required" });
  }
  if (!instituteId && !idNumber) {
    return res
      .status(400)
      .json({ error: "Either institute ID or ID number is required" });
  }
  const pool = getDB();

  try {
    let certificates;

    // Try to verify by roll_number + id_number first
    if (idNumber) {
      [certificates] = await pool.execute(
        "SELECT * FROM educational_certificates WHERE roll_number = ? AND id_number = ?",
        [rollNumber, idNumber]
      );
    }

    // Fallback to roll_number + institute_id if no match or if only instituteId provided
    if ((!certificates || certificates.length === 0) && instituteId) {
      [certificates] = await pool.execute(
        "SELECT * FROM educational_certificates WHERE roll_number = ? AND institute_id = ?",
        [rollNumber, instituteId]
      );
    }

    if (certificates.length === 0) {
      return res.json({
        success: false,
        message: "Certificate not found",
        data: { isAuthentic: false },
      });
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
      isAuthentic: true,
    };

    return res.json({ success: true, message: "Certificate verified", data });
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return res.status(500).json({ error: "Failed to verify certificate" });
  }
}
```

## Frontend Fix

Update `src/pages/VerifyEducation.tsx` line 65 to send idNumber:

```javascript
body: JSON.stringify({ rollNumber: roll, idNumber: id }),
```

Or change the frontend to ask for "Institute ID" instead of "ID Number" to match current backend.
