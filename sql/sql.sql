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


CREATE TABLE Plan (
    PlanID SERIAL PRIMARY KEY,
    PlanName VARCHAR(100) NOT NULL,
    Duration INT NOT NULL, -- in months
    Price NUMERIC(10, 2) NOT NULL,
);

CREATE TABLE Schedule (
    ScheduleID SERIAL PRIMARY KEY, /*auto increment*/
    MemberID INT REFERENCES Member(MemberID),
    TrainerName VARCHAR(10),
    DayOfWeek VARCHAR(10),
    TimeSlot VARCHAR(50)
);

/*not need*/
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

/* memberid name email message*/
CREATE TABLE Feedback (
    FeedbackID SERIAL PRIMARY KEY,
    MemberID INT REFERENCES Member(MemberID),
    TrainerID INT REFERENCES Trainer(TrainerID),
    FeedbackDate DATE NOT NULL DEFAULT CURRENT_DATE,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Comments TEXT
);