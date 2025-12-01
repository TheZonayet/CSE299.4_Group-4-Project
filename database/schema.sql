-- ============================================
-- Database Schema for ASURE Verification System
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS asure_verification_db;
USE asure_verification_db;

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    role ENUM('EDUCATION', 'MEDICINE', 'TUTORIALS', 'PERSONAL') NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    verification_credits INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- ============================================
-- Educational Institute Profiles
-- ============================================
CREATE TABLE IF NOT EXISTS educational_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    institute_id VARCHAR(100) UNIQUE,
    institute_name VARCHAR(255) NOT NULL,
    eiin_number VARCHAR(50),
    official_email VARCHAR(255),
    official_phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_institute_id (institute_id)
);

-- ============================================
-- Educational Certificates
-- ============================================
CREATE TABLE IF NOT EXISTS educational_certificates (
    id VARCHAR(36) PRIMARY KEY,
    roll_number VARCHAR(50) NOT NULL,
    id_number VARCHAR(50),
    institute_id VARCHAR(100) NOT NULL,
    institute_name VARCHAR(255),
    eiin_number VARCHAR(50),
    student_name VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    cgpa VARCHAR(10) NOT NULL,
    passing_year VARCHAR(4) NOT NULL,
    department VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_cert (roll_number, institute_id),
    INDEX idx_roll_institute (roll_number, institute_id),
    INDEX idx_institute (institute_id)
);

-- ============================================
-- Medicine Company Profiles
-- ============================================
CREATE TABLE IF NOT EXISTS medicine_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    company_id VARCHAR(100) UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    govt_license_number VARCHAR(100),
    official_email VARCHAR(255),
    official_phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_company_id (company_id)
);

-- ============================================
-- Medicines
-- ============================================
CREATE TABLE IF NOT EXISTS medicines (
    id VARCHAR(36) PRIMARY KEY,
    medicine_code VARCHAR(100) NOT NULL UNIQUE,
    medicine_name VARCHAR(255) NOT NULL,
    power VARCHAR(50),
    manufacturer VARCHAR(255) NOT NULL,
    batch_number VARCHAR(100) NOT NULL,
    expiry_date DATE NOT NULL,
    price DECIMAL(10, 2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_medicine_code (medicine_code),
    INDEX idx_medicine_name (medicine_name),
    INDEX idx_batch_number (batch_number)
);

-- ============================================
-- Tutorial Institute Profiles
-- ============================================
CREATE TABLE IF NOT EXISTS tutorial_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    institute_id VARCHAR(100) UNIQUE,
    institute_name VARCHAR(255) NOT NULL,
    govt_license_number VARCHAR(100),
    official_email VARCHAR(255),
    official_phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_institute_id (institute_id)
);

-- ============================================
-- Tutorial Certificates
-- ============================================
CREATE TABLE IF NOT EXISTS tutorial_certificates (
    id VARCHAR(36) PRIMARY KEY,
    certificate_id VARCHAR(100) NOT NULL UNIQUE,
    institute_id VARCHAR(100) NOT NULL,
    institute_name VARCHAR(255),
    student_name VARCHAR(255) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    completion_date DATE NOT NULL,
    duration VARCHAR(50),
    grade VARCHAR(20),
    skills TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_certificate_id (certificate_id),
    INDEX idx_institute_id (institute_id),
    INDEX idx_student_name (student_name)
);

-- ============================================
-- Verification History
-- ============================================
CREATE TABLE IF NOT EXISTS verification_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    verification_type ENUM('EDUCATION', 'MEDICINE', 'TUTORIAL', 'PRODUCT') NOT NULL,
    reference_id VARCHAR(100),
    status ENUM('SUCCESS', 'FAILED') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_verification_type (verification_type),
    INDEX idx_created_at (created_at)
);

-- ============================================
-- Products
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    product_code VARCHAR(100) NOT NULL UNIQUE,
    product_name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255),
    batch_number VARCHAR(100),
    manufacturing_date DATE,
    expiry_date DATE,
    description TEXT,
    qr_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_code (product_code),
    INDEX idx_product_name (product_name)
);

-- ============================================
-- Sample Data for Testing
-- ============================================

-- Insert sample user for education institute
INSERT INTO users (id, role, email, password_hash, verification_credits) VALUES
('edu-001', 'EDUCATION', 'admin@dhakacollege.edu', '$2a$10$YourHashedPasswordHere', 100),
('med-001', 'MEDICINE', 'admin@squarepharma.com', '$2a$10$YourHashedPasswordHere', 100),
('tut-001', 'TUTORIALS', 'admin@codecourse.com', '$2a$10$YourHashedPasswordHere', 100),
('per-001', 'PERSONAL', 'user@example.com', '$2a$10$YourHashedPasswordHere', 100);

-- Insert sample educational profile
INSERT INTO educational_profiles (user_id, institute_id, institute_name, eiin_number, official_email, official_phone) VALUES
('edu-001', 'INST-001', 'Dhaka College', '123456', 'admin@dhakacollege.edu', '+880123456789');

-- Insert sample educational certificate
INSERT INTO educational_certificates (id, roll_number, id_number, institute_id, institute_name, eiin_number, student_name, degree, cgpa, passing_year, department) VALUES
('cert-001', '2020001', 'ID-2020001', 'INST-001', 'Dhaka College', '123456', 'John Doe', 'Bachelor of Science', '3.75', '2024', 'Computer Science');

-- Insert sample medicine company profile
INSERT INTO medicine_profiles (user_id, company_id, company_name, govt_license_number, official_email, official_phone) VALUES
('med-001', 'MED-COMP-001', 'Square Pharma', 'LIC-12345', 'admin@squarepharma.com', '+880198765432');

-- Insert sample medicine
INSERT INTO medicines (id, medicine_code, medicine_name, power, manufacturer, batch_number, expiry_date, price, description) VALUES
('med-001', 'NAPA-500', 'Napa', '500mg', 'Square Pharma', 'BATCH-2024-001', '2026-12-31', 2.50, 'Paracetamol 500mg tablet for fever and pain relief');

-- Insert sample tutorial profile
INSERT INTO tutorial_profiles (user_id, institute_id, institute_name, govt_license_number, official_email, official_phone) VALUES
('tut-001', 'TUT-001', 'Code Course Academy', 'TUT-LIC-001', 'admin@codecourse.com', '+880187654321');

-- Insert sample tutorial certificate
INSERT INTO tutorial_certificates (id, certificate_id, institute_id, institute_name, student_name, course_name, completion_date, duration, grade, skills) VALUES
('tut-cert-001', 'CERT-TUT-001', 'TUT-001', 'Code Course Academy', 'Jane Smith', 'Full Stack Web Development', '2024-11-30', '6 months', 'A+', 'HTML,CSS,JavaScript,React,Node.js,MongoDB');
