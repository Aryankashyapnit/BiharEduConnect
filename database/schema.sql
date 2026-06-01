-- BiharEduConnect PostgreSQL Database Schema
-- Designed for Bihar Engineering Counselling (UGEAC / BCECE)

-- Drop tables if they exist
DROP TABLE IF EXISTS cutoffs CASCADE;
DROP TABLE IF EXISTS seat_distribution CASCADE;
DROP TABLE IF EXISTS branches CASCADE;
DROP TABLE IF EXISTS colleges CASCADE;

-- 1. Colleges Table
CREATE TABLE colleges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. MIT-MUZAFFARPUR, BCE-BHAGALPUR
    location VARCHAR(100) NOT NULL,
    established_year INT NOT NULL,
    nirf_rank INT,
    average_package DECIMAL(10, 2), -- in LPA
    highest_package DECIMAL(10, 2), -- in LPA
    tuition_fee DECIMAL(10, 2), -- Annual B.Tech fee
    hostel_available BOOLEAN DEFAULT TRUE,
    hostel_fee DECIMAL(10, 2), -- Annual hostel fee
    website VARCHAR(255),
    description TEXT,
    campus_size VARCHAR(100), -- e.g. "55 Acres"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Branches Table
CREATE TABLE branches (
    id SERIAL PRIMARY KEY,
    college_id INT REFERENCES colleges(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL, -- e.g. "Computer Science & Engineering"
    code VARCHAR(20) NOT NULL, -- e.g. "CSE", "ECE", "CE", "ME", "EE"
    seats INT NOT NULL,
    CONSTRAINT unique_college_branch UNIQUE (college_id, code)
);

-- 3. Seat Category Distribution Table
CREATE TABLE seat_distribution (
    id SERIAL PRIMARY KEY,
    college_id INT REFERENCES colleges(id) ON DELETE CASCADE,
    branch_code VARCHAR(20) NOT NULL,
    category VARCHAR(20) NOT NULL, -- "UR", "BC", "EBC", "SC", "ST", "EWS", "RCG", "DQ", "SMQ"
    seats INT NOT NULL,
    FOREIGN KEY (college_id, branch_code) REFERENCES branches(college_id, code) ON DELETE CASCADE
);

-- 4. Cutoffs Table
CREATE TABLE cutoffs (
    id SERIAL PRIMARY KEY,
    college_id INT REFERENCES colleges(id) ON DELETE CASCADE,
    branch_code VARCHAR(20) NOT NULL,
    year INT NOT NULL, -- e.g. 2024, 2025
    round INT NOT NULL, -- e.g. 1, 2, 3
    category VARCHAR(20) NOT NULL, -- "UR", "BC", "EBC", "SC", "ST", "EWS", "RCG", "DQ", "SMQ"
    gender VARCHAR(10) NOT NULL DEFAULT 'Co-ed', -- 'Co-ed' or 'Female' (for RCG / exclusive seats)
    opening_rank INT NOT NULL,
    closing_rank INT NOT NULL,
    FOREIGN KEY (college_id, branch_code) REFERENCES branches(college_id, code) ON DELETE CASCADE
);

-- Create Indexes for fast querying
CREATE INDEX idx_cutoffs_lookup ON cutoffs(year, round, category, closing_rank);
CREATE INDEX idx_colleges_code ON colleges(code);
CREATE INDEX idx_branches_code ON branches(code);
