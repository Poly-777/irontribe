CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  mobile VARCHAR(15) NOT NULL,
  emailid VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


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
