-- DROP tables if they already exist (to avoid duplicates during testing)
DROP TABLE IF EXISTS Report, Feedback, Payment, Attendance, Schedule, Plan, Trainer, Member, users CASCADE;

-- 1. Users Table (Authentication)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    emailid VARCHAR(255) UNIQUE NOT NULL, -- used as unique identifier
    password VARCHAR(255) NOT NULL,       -- hashed password
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Member Table (linked to users by user id)
CREATE TABLE Member (
    MemberID INT PRIMARY KEY,              -- FK from users(id)
    Name VARCHAR(100) NOT NULL,
    Age INT,
    Sex VARCHAR(10),
    Height INT,
    Weight INT,
    BodyShape VARCHAR(50),
    Notes TEXT,
    Address VARCHAR(255),
    PhotoURL VARCHAR(255),
    JoinDate DATE DEFAULT CURRENT_DATE,    -- ADDED: JoinDate column
    FOREIGN KEY (MemberID) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Plan Table
CREATE TABLE Plan (
    PlanID SERIAL PRIMARY KEY,
    PlanName VARCHAR(100) NOT NULL,
    Duration INT NOT NULL,                 -- in months
    Price NUMERIC(10, 2) NOT NULL
);

-- 4. Schedule Table
CREATE TABLE Schedule (
    ScheduleID SERIAL PRIMARY KEY,
    MemberID INT REFERENCES Member(MemberID) ON DELETE CASCADE,
    TrainerName VARCHAR(100),
    DayOfWeek VARCHAR(10),
    TimeSlot VARCHAR(50)
);

-- 5. Payment Table
CREATE TABLE Payment (
    PaymentID SERIAL PRIMARY KEY,
    MemberID INT REFERENCES Member(MemberID) ON DELETE CASCADE,
    Amount NUMERIC(10, 2) NOT NULL,
    PaymentDate DATE NOT NULL DEFAULT CURRENT_DATE,
    DueDate DATE,
    PaymentStatus VARCHAR(50),
    PlanID INT REFERENCES Plan(PlanID),
    PaymentMethod VARCHAR(50)
);

-- 6. Feedback Table
CREATE TABLE Feedback (
    FeedbackID SERIAL PRIMARY KEY,
    MemberID INT REFERENCES Member(MemberID) ON DELETE CASCADE,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Message TEXT NOT NULL,
    SubmittedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);




-- -- select * from users;
-- select * from member;

ALTER TABLE Member
  ALTER COLUMN Address TYPE TEXT,
  ALTER COLUMN PhotoURL TYPE TEXT,
  ALTER COLUMN Notes TYPE TEXT;

-- -- select * from plan;
-- select * from schedule;
-- -- select * from payment;
-- -- select * from feedback;

DELETE FROM users;
DELETE FROM members;
DELETE FROM schedule;


