-- BiharEduConnect Supabase PostgreSQL Database Schema
-- Run this schema script in the Supabase SQL Editor

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS visitor_logs CASCADE;
DROP TABLE IF EXISTS registered_users CASCADE;
DROP TABLE IF EXISTS seat_matrix CASCADE;
DROP TABLE IF EXISTS cutoffs CASCADE;
DROP TABLE IF EXISTS colleges CASCADE;

-- 1. Colleges Table
CREATE TABLE colleges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    location TEXT NOT NULL,
    established INT NOT NULL,
    nirf INT,
    "averagePackage" DECIMAL(10, 2), -- in LPA
    "highestPackage" DECIMAL(10, 2), -- in LPA
    "tuitionFee" DECIMAL(10, 2),
    "hostelAvailable" BOOLEAN DEFAULT TRUE,
    "hostelFee" DECIMAL(10, 2),
    website TEXT,
    description TEXT,
    "campusSize" TEXT,
    branches TEXT[] DEFAULT '{}',
    recruits TEXT[] DEFAULT '{}',
    image TEXT
);

-- 2. Cutoffs Table
CREATE TABLE cutoffs (
    id TEXT PRIMARY KEY,
    "collegeCode" TEXT NOT NULL,
    "branchCode" TEXT NOT NULL,
    year INT NOT NULL,
    round INT NOT NULL,
    category TEXT NOT NULL,
    gender TEXT NOT NULL DEFAULT 'Co-ed',
    "openingRank" INT NOT NULL,
    "closingRank" INT NOT NULL
);

-- 3. Seat Matrix Table
CREATE TABLE seat_matrix (
    id TEXT PRIMARY KEY, -- format: {collegeCode}_{branchCode}
    "collegeCode" TEXT NOT NULL,
    "branchCode" TEXT NOT NULL,
    "totalSeats" INT NOT NULL,
    "categorySeats" JSONB NOT NULL
);

-- 4. Registered Users Table
CREATE TABLE registered_users (
    email TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    percentile DECIMAL(5, 2) NOT NULL,
    password TEXT,
    "isPremium" BOOLEAN DEFAULT FALSE
);

-- 5. Visitor Logs Table
CREATE TABLE visitor_logs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    percentile DECIMAL(5, 2),
    "visitCount" INT NOT NULL DEFAULT 1,
    "lastVisitTime" TEXT NOT NULL,
    "lastVisitTimestamp" BIGINT,
    role TEXT NOT NULL,
    "totalSessionTime" BIGINT DEFAULT 0,
    "lastActivity" BIGINT
);

-- Indexes for performance optimization
CREATE INDEX idx_supa_cutoffs_lookup ON cutoffs(year, round, category, "closingRank");
CREATE INDEX idx_supa_colleges_code ON colleges(code);
CREATE INDEX idx_supa_seat_matrix_lookup ON seat_matrix("collegeCode", "branchCode");
CREATE INDEX idx_supa_visitor_logs_time ON visitor_logs("lastVisitTimestamp" DESC);
