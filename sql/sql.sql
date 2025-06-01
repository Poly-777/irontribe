-- DROP tables if they already exist (to avoid duplicates during testing)
DROP TABLE IF EXISTS Report, Feedback, Payment, Attendance, Schedule, Plan, Trainer, Member, users CASCADE;

-- TABLE CREATION

-- users table (for authentication)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    emailid VARCHAR(255) UNIQUE NOT NULL, -- Matched to frontend 'emailid' and backend 'email'
    password VARCHAR(255) NOT NULL, -- Storing the hashed password (no 'password_hash')
    role VARCHAR(50) NOT NULL DEFAULT 'member', -- 'admin' or 'member'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Member table (updated as per your latest schema, linked by Email)
CREATE TABLE Member (
    MemberID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL, -- Email should ideally match a user's emailid
    Phone VARCHAR(15),
    Address TEXT,
    DOB DATE,
    Gender VARCHAR(10),
    JoinDate DATE DEFAULT CURRENT_DATE,
    MembershipStatus VARCHAR(50) DEFAULT 'Pending',
    TermsAccepted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE Trainer (
    TrainerID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(15),
    Specialization VARCHAR(100)
);

CREATE TABLE Plan (
    PlanID SERIAL PRIMARY KEY,
    PlanName VARCHAR(100) NOT NULL,
    Duration INT NOT NULL, -- in months
    Price NUMERIC(10, 2) NOT NULL,
    Description TEXT
);

CREATE TABLE Schedule (
    ScheduleID SERIAL PRIMARY KEY,
    MemberID INT REFERENCES Member(MemberID),
    TrainerID INT REFERENCES Trainer(TrainerID),
    DayOfWeek VARCHAR(10),
    TimeSlot VARCHAR(50)
);

CREATE TABLE Attendance (
    AttendanceID SERIAL PRIMARY KEY,
    MemberID INT REFERENCES Member(MemberID),
    CheckInDate DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE Payment (
    PaymentID SERIAL PRIMARY KEY,
    MemberID INT REFERENCES Member(MemberID),
    Amount NUMERIC(10, 2) NOT NULL,
    PaymentDate DATE NOT NULL DEFAULT CURRENT_DATE,
    DueDate DATE,
    PaymentStatus VARCHAR(50),
    PlanID INT REFERENCES Plan(PlanID), -- ADDED THIS LINE
    PaymentMethod VARCHAR(50) -- ADDED THIS LINE
);

CREATE TABLE Feedback (
    FeedbackID SERIAL PRIMARY KEY,
    MemberID INT REFERENCES Member(MemberID),
    TrainerID INT REFERENCES Trainer(TrainerID),
    FeedbackDate DATE NOT NULL DEFAULT CURRENT_DATE,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Comments TEXT
);

CREATE TABLE Report (
    ReportID SERIAL PRIMARY KEY,
    ReportType VARCHAR(50),
    GeneratedDate DATE DEFAULT CURRENT_DATE,
    SQLQuery TEXT
);

-- INSERT SAMPLE DATA

-- Users (for login) - assuming some users exist
-- Replace the password hashes with actual bcrypt hashes generated for 'adminpassword' and 'memberpassword'
-- You can generate hashes in a Node.js console:
-- const bcrypt = require('bcryptjs');
-- bcrypt.hash('adminpassword', 10).then(hash => console.log(hash));
-- bcrypt.hash('memberpassword', 10).then(hash => console.log(hash));

INSERT INTO users (name, mobile, emailid, password, role)
VALUES
('Admin User', '9876543210', 'admin@example.com', '$2a$10$e.g.Y1mZ2x3y4z5a6b7c8d9e0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0', 'admin')
ON CONFLICT (emailid) DO NOTHING;

INSERT INTO users (name, mobile, emailid, password, role)
VALUES
('Member User', '1122334455', 'member@example.com', '$2a$10$e.g.A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0', 'member')
ON CONFLICT (emailid) DO NOTHING;

-- Members (ensure emails match users for testing)
INSERT INTO Member (Name, Email, Phone, Address, DOB, Gender, MembershipStatus, TermsAccepted)
VALUES
('Admin User', 'admin@example.com', '9876543210', '101 Admin Rd', '1980-01-01', 'Male', 'Active', TRUE)
ON CONFLICT (Email) DO NOTHING;

INSERT INTO Member (Name, Email, Phone, Address, DOB, Gender, MembershipStatus, TermsAccepted)
VALUES
('Member User', 'member@example.com', '1122334455', '202 Member St', '1995-05-05', 'Female', 'Active', TRUE)
ON CONFLICT (Email) DO NOTHING;

INSERT INTO Member (Name, Email, Phone, Address, DOB, Gender, MembershipStatus, TermsAccepted)
VALUES
('John Doe', 'john@example.com', '1234567890', '123 Main St', '1990-01-01', 'Male', 'Active', TRUE)
ON CONFLICT (Email) DO NOTHING;

INSERT INTO Member (Name, Email, Phone, Address, DOB, Gender, MembershipStatus, TermsAccepted)
VALUES
('Jane Smith', 'jane@example.com', '2345678901', '456 Park Ave', '1992-05-15', 'Female', 'Inactive', TRUE)
ON CONFLICT (Email) DO NOTHING;

INSERT INTO Member (Name, Email, Phone, Address, DOB, Gender, MembershipStatus, TermsAccepted)
VALUES
('Mike Johnson', 'mike@example.com', '3456789012', '789 Oak Blvd', '1985-11-21', 'Male', 'Active', TRUE)
ON CONFLICT (Email) DO NOTHING;

INSERT INTO Member (Name, Email, Phone, Address, DOB, Gender, MembershipStatus, TermsAccepted)
VALUES
('Emily Davis', 'emily@example.com', '4567890123', '321 Elm St', '1998-03-10', 'Female', 'Pending', FALSE)
ON CONFLICT (Email) DO NOTHING;

INSERT INTO Member (Name, Email, Phone, Address, DOB, Gender, MembershipStatus, TermsAccepted)
VALUES
('Robert Brown', 'robert@example.com', '5678901234', '654 Pine Rd', '1995-07-07', 'Male', 'Active', TRUE)
ON CONFLICT (Email) DO NOTHING;

-- Trainers
INSERT INTO Trainer (Name, Email, Phone, Specialization)
VALUES
('Alice Trainer', 'alice@trainer.com', '1231231234', 'Yoga'),
('Bob Fit', 'bob@trainer.com', '2342342345', 'Cardio'),
('Charlie Gym', 'charlie@trainer.com', '3453453456', 'Weightlifting'),
('Diana Coach', 'diana@trainer.com', '4564564567', 'Pilates'),
('Ethan Strong', 'ethan@trainer.com', '5675675678', 'Crossfit');

-- Plans
INSERT INTO Plan (PlanName, Duration, Price, Description)
VALUES
('Basic Plan', 1, 49.99, 'Access to gym floor only'),
('Standard Plan', 3, 129.99, 'Gym floor + 2 classes/week'),
('Premium Plan', 6, 239.99, 'All access + trainer support'),
('Family Plan', 3, 199.99, 'Access for 3 family members'),
('Student Plan', 2, 79.99, 'Discounted plan for students');

-- Schedule (using MemberID and TrainerID from above)
INSERT INTO Schedule (MemberID, TrainerID, DayOfWeek, TimeSlot)
SELECT M.MemberID, T.TrainerID, 'Monday', '08:00 - 09:00'
FROM Member M, Trainer T
WHERE M.Email = 'john@example.com' AND T.Email = 'alice@trainer.com'
ON CONFLICT DO NOTHING;

INSERT INTO Schedule (MemberID, TrainerID, DayOfWeek, TimeSlot)
SELECT M.MemberID, T.TrainerID, 'Tuesday', '10:00 - 11:00'
FROM Member M, Trainer T
WHERE M.Email = 'jane@example.com' AND T.Email = 'bob@trainer.com'
ON CONFLICT DO NOTHING;

-- Attendance
INSERT INTO Attendance (MemberID, CheckInDate)
SELECT MemberID, '2025-05-01' FROM Member WHERE Email = 'john@example.com' ON CONFLICT DO NOTHING;
INSERT INTO Attendance (MemberID, CheckInDate)
SELECT MemberID, '2025-05-02' FROM Member WHERE Email = 'jane@example.com' ON CONFLICT DO NOTHING;
INSERT INTO Attendance (MemberID, CheckInDate)
SELECT MemberID, '2025-05-03' FROM Member WHERE Email = 'john@example.com' ON CONFLICT DO NOTHING;


-- Payments (UPDATED to include PlanID and PaymentMethod)
INSERT INTO Payment (MemberID, Amount, PaymentDate, DueDate, PaymentStatus, PlanID, PaymentMethod)
SELECT M.MemberID, 49.99, '2025-05-01', '2025-06-01', 'Paid', P.PlanID, 'Card'
FROM Member M, Plan P
WHERE M.Email = 'john@example.com' AND P.PlanName = 'Basic Plan'
ON CONFLICT DO NOTHING;

INSERT INTO Payment (MemberID, Amount, PaymentDate, DueDate, PaymentStatus, PlanID, PaymentMethod)
SELECT M.MemberID, 129.99, '2025-04-15', '2025-07-15', 'Paid', P.PlanID, 'UPI'
FROM Member M, Plan P
WHERE M.Email = 'jane@example.com' AND P.PlanName = 'Standard Plan'
ON CONFLICT DO NOTHING;

INSERT INTO Payment (MemberID, Amount, PaymentDate, DueDate, PaymentStatus, PlanID, PaymentMethod)
SELECT M.MemberID, 239.99, '2025-05-10', '2025-11-10', 'Unpaid', P.PlanID, 'Bank Transfer'
FROM Member M, Plan P
WHERE M.Email = 'mike@example.com' AND P.PlanName = 'Premium Plan'
ON CONFLICT DO NOTHING;

INSERT INTO Payment (MemberID, Amount, PaymentDate, DueDate, PaymentStatus, PlanID, PaymentMethod)
SELECT M.MemberID, 199.99, '2025-03-20', '2025-06-20', 'Paid', P.PlanID, 'Card'
FROM Member M, Plan P
WHERE M.Email = 'emily@example.com' AND P.PlanName = 'Family Plan'
ON CONFLICT DO NOTHING;

INSERT INTO Payment (MemberID, Amount, PaymentDate, DueDate, PaymentStatus, PlanID, PaymentMethod)
SELECT M.MemberID, 79.99, '2025-05-05', '2025-07-05', 'Pending', P.PlanID, 'UPI'
FROM Member M, Plan P
WHERE M.Email = 'robert@example.com' AND P.PlanName = 'Student Plan'
ON CONFLICT DO NOTHING;


-- Feedback
INSERT INTO Feedback (MemberID, TrainerID, FeedbackDate, Rating, Comments)
VALUES
(1, 1, '2025-05-10', 5, 'Great training!'),
(2, 2, '2025-05-11', 4, 'Very helpful.'),
(3, 3, '2025-05-12', 3, 'Average experience.'),
(4, 4, '2025-05-13', 5, 'Amazing support!'),
(5, 5, '2025-05-14', 2, 'Needs improvement.');

-- Reports
INSERT INTO Report (ReportType, SQLQuery)
VALUES
('Payment Summary', 'SELECT MemberID, SUM(Amount) FROM Payment GROUP BY MemberID;'),
('Attendance Report', 'SELECT MemberID, COUNT(*) FROM Attendance GROUP BY MemberID;'),
('Trainer Feedback', 'SELECT TrainerID, AVG(Rating) FROM Feedback GROUP BY TrainerID;'),
('Active Members', 'SELECT * FROM Member WHERE MembershipStatus = ''Active'';'),
('Due Payments', 'SELECT * FROM Payment WHERE PaymentStatus = ''Unpaid'';');
