-- ============================================
-- Additional Sample Data for ASURE System
-- ============================================

USE asure_verification_db;

-- More Educational Certificates
INSERT INTO educational_certificates (id, roll_number, id_number, institute_id, institute_name, eiin_number, student_name, degree, cgpa, passing_year, department) VALUES
('cert-002', '2020002', 'ID-2020002', 'INST-001', 'Dhaka College', '123456', 'Sarah Ahmed', 'Bachelor of Arts', '3.85', '2024', 'English Literature'),
('cert-003', '2020003', 'ID-2020003', 'INST-001', 'Dhaka College', '123456', 'Michael Khan', 'Bachelor of Science', '3.90', '2024', 'Physics'),
('cert-004', '2020004', 'ID-2020004', 'INST-001', 'Dhaka College', '123456', 'Fatima Rahman', 'Bachelor of Commerce', '3.70', '2024', 'Accounting');

-- More Medicines
INSERT INTO medicines (id, medicine_code, medicine_name, power, manufacturer, batch_number, expiry_date, price, description) VALUES
('med-002', 'HISTACIN-10', 'Histacin', '10mg', 'Square Pharma', 'BATCH-2024-002', '2026-12-31', 5.00, 'Cetirizine 10mg for allergy relief'),
('med-003', 'SECLO-20', 'Seclo', '20mg', 'Square Pharma', 'BATCH-2024-003', '2027-06-30', 8.50, 'Omeprazole 20mg for gastric problems'),
('med-004', 'FLEXI-50', 'Flexi', '50mg', 'Square Pharma', 'BATCH-2024-004', '2026-09-30', 12.00, 'Diclofenac 50mg for pain and inflammation');

-- More Tutorial Certificates
INSERT INTO tutorial_certificates (id, certificate_id, institute_id, institute_name, student_name, course_name, completion_date, duration, grade, skills) VALUES
('tut-cert-002', 'CERT-TUT-002', 'TUT-001', 'Code Course Academy', 'Ahmed Hassan', 'Python Data Science', '2024-10-15', '4 months', 'A', 'Python,Pandas,NumPy,Matplotlib,Machine Learning'),
('tut-cert-003', 'CERT-TUT-003', 'TUT-001', 'Code Course Academy', 'Nadia Islam', 'Mobile App Development', '2024-11-20', '5 months', 'A+', 'React Native,Firebase,Redux,JavaScript'),
('tut-cert-004', 'CERT-TUT-004', 'TUT-001', 'Code Course Academy', 'Rafiq Chowdhury', 'Digital Marketing', '2024-09-30', '3 months', 'B+', 'SEO,Social Media Marketing,Google Ads,Content Marketing');

-- Sample Products
INSERT INTO products (id, product_code, product_name, manufacturer, batch_number, manufacturing_date, expiry_date, description) VALUES
('prod-001', 'PROD-2024-001', 'Organic Honey', 'Pure Nature Ltd', 'BATCH-H-001', '2024-01-15', '2026-01-15', 'Pure organic honey 500g'),
('prod-002', 'PROD-2024-002', 'Green Tea Extract', 'Health Plus Co', 'BATCH-GT-001', '2024-02-20', '2026-02-20', 'Premium green tea extract capsules'),
('prod-003', 'PROD-2024-003', 'Vitamin C Tablets', 'Wellness Corp', 'BATCH-VC-001', '2024-03-10', '2026-03-10', 'Vitamin C 1000mg tablets');

-- Sample Verification History
INSERT INTO verification_history (user_id, verification_type, reference_id, status) VALUES
('per-001', 'EDUCATION', '2020001', 'SUCCESS'),
('per-001', 'MEDICINE', 'NAPA-500', 'SUCCESS'),
('per-001', 'TUTORIAL', 'CERT-TUT-001', 'SUCCESS'),
('per-001', 'EDUCATION', '9999999', 'FAILED'),
('per-001', 'MEDICINE', 'FAKE-MED', 'FAILED');
