-- Seed data for BiharEduConnect
-- Top Bihar Engineering Colleges, Branches, and Cutoffs

-- 1. Insert Colleges
INSERT INTO colleges (name, code, location, established_year, nirf_rank, average_package, highest_package, tuition_fee, hostel_available, hostel_fee, website, description, campus_size) VALUES
('Muzaffarpur Institute of Technology', 'MIT-MUZAFFARPUR', 'Muzaffarpur', 1954, 151, 5.80, 18.00, 10500.00, TRUE, 12000.00, 'https://www.mitmuzaffarpur.org', 'Muzaffarpur Institute of Technology (MIT) is a premier state-government aided engineering college under BCECE, renowned for its rich academic heritage, sprawling campus, and excellent laboratory infrastructures.', '55 Acres'),
('Bhagalpur College of Engineering', 'BCE-BHAGALPUR', 'Bhagalpur', 1960, 201, 5.20, 15.60, 9800.00, TRUE, 11000.00, 'https://www.bcebhagalpur.ac.in', 'Bhagalpur College of Engineering (BCE) is one of the oldest and most prestigious state engineering colleges in Bihar. It has a strong legacy of producing exceptional civil, mechanical, and electrical engineers.', '50 Acres'),
('Gaya College of Engineering', 'GCE-GAYA', 'Gaya', 2008, NULL, 4.50, 12.00, 8500.00, TRUE, 9500.00, 'https://www.gcegaya.ac.in', 'Gaya College of Engineering (GCE) provides excellent technical education and skills, backed by highly qualified faculty members and state-of-the-art computational facilities in southern Bihar.', '42 Acres'),
('Nalanda College of Engineering', 'NCE-CHANDI', 'Chandi, Nalanda', 2008, NULL, 4.30, 10.50, 8500.00, TRUE, 9000.00, 'https://www.ncechandi.ac.in', 'Nalanda College of Engineering (NCE) is located in Chandi near the historic ruins of Nalanda. The institution emphasizes research, discipline, and outstanding technical expertise.', '38 Acres'),
('Darbhanga College of Engineering', 'DCE-DARBHANGA', 'Darbhanga', 2008, NULL, 4.10, 9.80, 8500.00, TRUE, 9500.00, 'https://www.dcedarbhanga.ac.in', 'Darbhanga College of Engineering (DCE) serves as a major hub of technical excellence in North Bihar, offering cutting-edge B.Tech programs in diverse fields of engineering.', '40 Acres'),
('Bakhtiyarpur College of Engineering', 'BCE-BAKHTIYARPUR', 'Bakhtiyarpur, Patna', 2016, NULL, 4.60, 14.00, 9500.00, TRUE, 10500.00, 'https://www.bcepatna.ac.in', 'Located in the Patna metropolitan region, Bakhtiyarpur College of Engineering (BCE Patna) boasts state-of-the-art campus buildings, superb transit links, and strong placement tie-ups.', '25 Acres'),
('Motihari College of Engineering', 'MCE-MOTIHARI', 'Motihari', 2008, NULL, 3.90, 8.50, 8500.00, TRUE, 9000.00, 'https://www.mcemotihari.ac.in', 'Motihari College of Engineering (MCE) is a premier engineering college situated in Champaran, promoting quality technical education and local entrepreneurial development.', '35 Acres');

-- 2. Insert Branches (MIT-Muzaffarpur id = 1, BCE-Bhagalpur id = 2, GCE-Gaya id = 3, etc.)
INSERT INTO branches (college_id, name, code, seats) VALUES
(1, 'Computer Science & Engineering', 'CSE', 60),
(1, 'Information Technology', 'IT', 40),
(1, 'Electronics & Communication Engineering', 'ECE', 60),
(1, 'Electrical Engineering', 'EE', 60),
(1, 'Mechanical Engineering', 'ME', 60),
(1, 'Civil Engineering', 'CE', 60),

(2, 'Computer Science & Engineering', 'CSE', 60),
(2, 'Electronics & Communication Engineering', 'ECE', 60),
(2, 'Electrical Engineering', 'EE', 60),
(2, 'Mechanical Engineering', 'ME', 60),
(2, 'Civil Engineering', 'CE', 60),

(3, 'Computer Science & Engineering', 'CSE', 60),
(3, 'Electrical & Electronics Engineering', 'EEE', 60),
(3, 'Mechanical Engineering', 'ME', 60),
(3, 'Civil Engineering', 'CE', 60),

(4, 'Computer Science & Engineering', 'CSE', 60),
(4, 'Electrical & Electronics Engineering', 'EEE', 60),
(4, 'Mechanical Engineering', 'ME', 60),
(4, 'Civil Engineering', 'CE', 60),

(6, 'Computer Science & Engineering', 'CSE', 60),
(6, 'Electrical & Electronics Engineering', 'EEE', 60),
(6, 'Mechanical Engineering', 'ME', 60),
(6, 'Civil Engineering', 'CE', 60);

-- 3. Insert Seat Distributions (Example for MIT CSE and BCE CSE)
-- Category codes: UR (Unreserved), BC (Backward Class), EBC (Extremely Backward Class), SC (Scheduled Caste), ST (Scheduled Tribe), EWS (Economically Weaker Sections), RCG (Reserved Category Girls), DQ (Disabled Quota)
INSERT INTO seat_distribution (college_id, branch_code, category, seats) VALUES
(1, 'CSE', 'UR', 24),
(1, 'CSE', 'BC', 7),
(1, 'CSE', 'EBC', 11),
(1, 'CSE', 'SC', 10),
(1, 'CSE', 'ST', 1),
(1, 'CSE', 'EWS', 6),
(1, 'CSE', 'RCG', 1),
(1, 'CSE', 'DQ', 3),

(2, 'CSE', 'UR', 24),
(2, 'CSE', 'BC', 7),
(2, 'CSE', 'EBC', 11),
(2, 'CSE', 'SC', 10),
(2, 'CSE', 'ST', 1),
(2, 'CSE', 'EWS', 6),
(2, 'CSE', 'RCG', 1),
(2, 'CSE', 'DQ', 3);

-- 4. Insert Cutoffs (2025 and 2024 Rounds)
INSERT INTO cutoffs (college_id, branch_code, year, round, category, gender, opening_rank, closing_rank) VALUES
-- MIT CSE 2025 Round 1
(1, 'CSE', 2025, 1, 'UR', 'Co-ed', 1, 240),
(1, 'CSE', 2025, 1, 'BC', 'Co-ed', 241, 380),
(1, 'CSE', 2025, 1, 'EBC', 'Co-ed', 245, 410),
(1, 'CSE', 2025, 1, 'SC', 'Co-ed', 500, 850),
(1, 'CSE', 2025, 1, 'EWS', 'Co-ed', 250, 420),
(1, 'CSE', 2025, 1, 'RCG', 'Female', 300, 520),

-- MIT CSE 2025 Round 2
(1, 'CSE', 2025, 2, 'UR', 'Co-ed', 241, 290),
(1, 'CSE', 2025, 2, 'BC', 'Co-ed', 381, 410),
(1, 'CSE', 2025, 2, 'EBC', 'Co-ed', 411, 460),
(1, 'CSE', 2025, 2, 'SC', 'Co-ed', 851, 950),

-- MIT ECE 2025 Round 1
(1, 'ECE', 2025, 1, 'UR', 'Co-ed', 150, 480),
(1, 'ECE', 2025, 1, 'BC', 'Co-ed', 481, 620),
(1, 'ECE', 2025, 1, 'EBC', 'Co-ed', 490, 710),
(1, 'ECE', 2025, 1, 'SC', 'Co-ed', 900, 1300),

-- BCE CSE 2025 Round 1
(2, 'CSE', 2025, 1, 'UR', 'Co-ed', 180, 450),
(2, 'CSE', 2025, 1, 'BC', 'Co-ed', 451, 580),
(2, 'CSE', 2025, 1, 'EBC', 'Co-ed', 460, 680),
(2, 'CSE', 2025, 1, 'SC', 'Co-ed', 800, 1150),

-- GCE CSE 2025 Round 1
(3, 'CSE', 2025, 1, 'UR', 'Co-ed', 400, 850),
(3, 'CSE', 2025, 1, 'BC', 'Co-ed', 851, 1050),
(3, 'CSE', 2025, 1, 'EBC', 'Co-ed', 860, 1200),
(3, 'CSE', 2025, 1, 'SC', 'Co-ed', 1200, 1800);
