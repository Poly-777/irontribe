CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  mobile VARCHAR(15) NOT NULL,
  emailid VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- DROP tables if they already exist (to avoid duplicates during testing)
DROP TABLE IF EXISTS Report, Feedback, Payment, Attendance, Schedule, Plan, Trainer, Member CASCADE;

-- TABLE CREATION

CREATE TABLE Member (
    MemberID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(15),
    Address TEXT,
    DOB DATE,
    Gender VARCHAR(10),
    JoinDate DATE DEFAULT CURRENT_DATE,
    MembershipStatus VARCHAR(50),
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
    PaymentStatus VARCHAR(50)
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

-- Members
INSERT INTO Member (Name, Email, Phone, Address, DOB, Gender, MembershipStatus, TermsAccepted)
VALUES 
('John Doe', 'john@example.com', '1234567890', '123 Main St', '1990-01-01', 'Male', 'Active', TRUE),
('Jane Smith', 'jane@example.com', '2345678901', '456 Park Ave', '1992-05-15', 'Female', 'Inactive', TRUE),
('Mike Johnson', 'mike@example.com', '3456789012', '789 Oak Blvd', '1985-11-21', 'Male', 'Active', TRUE),
('Emily Davis', 'emily@example.com', '4567890123', '321 Elm St', '1998-03-10', 'Female', 'Pending', FALSE),
('Robert Brown', 'robert@example.com', '5678901234', '654 Pine Rd', '1995-07-07', 'Male', 'Active', TRUE);

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

-- Schedule
INSERT INTO Schedule (MemberID, TrainerID, DayOfWeek, TimeSlot)
VALUES
(1, 1, 'Monday', '08:00 - 09:00'),
(2, 2, 'Tuesday', '10:00 - 11:00'),
(3, 3, 'Wednesday', '07:00 - 08:00'),
(4, 4, 'Thursday', '09:00 - 10:00'),
(5, 5, 'Friday', '06:00 - 07:00');

-- Attendance
INSERT INTO Attendance (MemberID, CheckInDate)
VALUES
(1, '2025-05-01'),
(2, '2025-05-02'),
(3, '2025-05-03'),
(4, '2025-05-04'),
(5, '2025-05-05');

-- Payments
INSERT INTO Payment (MemberID, Amount, PaymentDate, DueDate, PaymentStatus)
VALUES
(1, 49.99, '2025-05-01', '2025-06-01', 'Paid'),
(2, 129.99, '2025-04-15', '2025-07-15', 'Paid'),
(3, 239.99, '2025-05-10', '2025-11-10', 'Unpaid'),
(4, 199.99, '2025-03-20', '2025-06-20', 'Paid'),
(5, 79.99, '2025-05-05', '2025-07-05', 'Pending');

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
