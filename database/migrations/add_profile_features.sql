-- ============================================
-- Migration: Add Profile Pictures and Payment System
-- ============================================

USE asure_verification_db;

-- Add profile picture columns to all profile tables
ALTER TABLE educational_profiles 
ADD COLUMN IF NOT EXISTS profile_picture TEXT AFTER address,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE medicine_profiles 
ADD COLUMN IF NOT EXISTS profile_picture TEXT AFTER address,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE tutorial_profiles 
ADD COLUMN IF NOT EXISTS profile_picture TEXT AFTER address,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Add credit tracking fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS monthly_credits_used INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_credit_reset DATE DEFAULT (CURRENT_DATE),
ADD COLUMN IF NOT EXISTS total_credits_purchased INT DEFAULT 0;

-- ============================================
-- Payments Table
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    credits_purchased INT NOT NULL,
    payment_method ENUM('bkash', 'visa', 'mastercard', 'bank_transfer') NOT NULL,
    transaction_id VARCHAR(100),
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_payment_date (payment_date)
);

-- ============================================
-- Credit Packages Table
-- ============================================
CREATE TABLE IF NOT EXISTS credit_packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    credits INT NOT NULL,
    price_bdt DECIMAL(10, 2) NOT NULL,
    price_usd DECIMAL(10, 2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default credit packages
INSERT INTO credit_packages (name, credits, price_bdt, price_usd, description) VALUES
('Starter Pack', 50, 500.00, 5.00, '50 additional verification credits'),
('Basic Pack', 100, 900.00, 9.00, '100 additional verification credits - 10% savings'),
('Standard Pack', 250, 2000.00, 20.00, '250 additional verification credits - 20% savings'),
('Premium Pack', 500, 3500.00, 35.00, '500 additional verification credits - 30% savings'),
('Enterprise Pack', 1000, 6000.00, 60.00, '1000 additional verification credits - 40% savings');

-- ============================================
-- Credit Usage History Table
-- ============================================
CREATE TABLE IF NOT EXISTS credit_usage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    credits_used INT NOT NULL,
    verification_type ENUM('education', 'medicine', 'product', 'tutorial') NOT NULL,
    description VARCHAR(255),
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_used_at (used_at)
);
