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

-- -- INSERT SAMPLE DATA

-- -- Users (for login) - assuming some users exist
-- -- Replace the password hashes with actual bcrypt hashes generated for 'adminpassword' and 'memberpassword'
-- -- You can generate hashes in a Node.js console:
-- -- const bcrypt = require('bcryptjs');
-- -- bcrypt.hash('adminpassword', 10).then(hash => console.log(hash));
-- -- bcrypt.hash('memberpassword', 10).then(hash => console.log(hash));

-- INSERT INTO users (name, mobile, emailid, password)
-- VALUES
-- ('Admin User', '9876543210', 'admin@example.com', '$2a$10$e.g.Y1mZ2x3y4z5a6b7c8d9e0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0', 'admin')
-- ON CONFLICT (emailid) DO NOTHING;

-- INSERT INTO users (name, mobile, emailid, password)
-- VALUES
-- ('Member User', '1122334455', 'member@example.com', '$2a$10$e.g.A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0', 'member')
-- ON CONFLICT (emailid) DO NOTHING;

-- -- Members (UPDATED with sample profile data and ProfileImageURL)
-- -- Note: MemberID must match an existing users.id
-- INSERT INTO Member (MemberID, Name, Age, Sex, Height, Weight, BodyShape, Notes, Address, PhotoURL, JoinDate)
-- SELECT u.id, u.name, 44, 'Male', 175.00, 75.00, 'Athletic', 'Administrator profile.', '101 Admin Rd', '/static/person.jpg', CURRENT_DATE
-- FROM users u WHERE u.emailid = 'admin@example.com'
-- ON CONFLICT (MemberID) DO NOTHING;

-- INSERT INTO Member (MemberID, Name, Age, Sex, Height, Weight, BodyShape, Notes, Address, PhotoURL, JoinDate)
-- SELECT u.id, u.name, 29, 'Female', 160.00, 58.00, 'Toned', 'Regular gym member, focusing on strength.', '202 Member St', '/static/person.jpg', CURRENT_DATE
-- FROM users u WHERE u.emailid = 'member@example.com'
-- ON CONFLICT (MemberID) DO NOTHING;

-- -- Add more sample members if needed, ensuring MemberID matches users.id
-- INSERT INTO Member (MemberID, Name, Age, Sex, Height, Weight, BodyShape, Notes, Address, PhotoURL, JoinDate)
-- SELECT u.id, u.name, 35, 'Male', 180.5, 80.2, 'Muscular', 'Goal: Increase bench press by 10kg.', '123 Main St', '/static/person.jpg', '2025-01-01'
-- FROM users u WHERE u.emailid = 'john@example.com'
-- ON CONFLICT (MemberID) DO NOTHING;

-- INSERT INTO Member (MemberID, Name, Age, Sex, Height, Weight, BodyShape, Notes, Address, PhotoURL, JoinDate)
-- SELECT u.id, u.name, 32, 'Female', 165.0, 60.0, 'Lean', 'Goal: Improve flexibility and endurance.', '456 Park Ave', '/static/person.jpg', '2025-02-15'
-- FROM users u WHERE u.emailid = 'jane@example.com'
-- ON CONFLICT (MemberID) DO NOTHING;


-- -- Trainers
-- INSERT INTO Trainer (Name, Email, Phone, Specialization)
-- VALUES
-- ('Alice Trainer', 'alice@trainer.com', '1231231234', 'Yoga'),
-- ('Bob Fit', 'bob@trainer.com', '2342342345', 'Cardio'),
-- ('Charlie Gym', 'charlie@trainer.com', '3453453456', 'Weightlifting'),
-- ('Diana Coach', 'diana@trainer.com', '4564564567', 'Pilates'),
-- ('Ethan Strong', 'ethan@trainer.com', '5675675678', 'Crossfit');

-- -- Plans
-- INSERT INTO Plan (PlanName, Duration, Price, Description)
-- VALUES
-- ('Basic Plan', 1, 49.99, 'Access to gym floor only'),
-- ('Standard Plan', 3, 129.99, 'Gym floor + 2 classes/week'),
-- ('Premium Plan', 6, 239.99, 'All access + trainer support'),
-- ('Family Plan', 3, 199.99, 'Access for 3 family members'),
-- ('Student Plan', 2, 79.99, 'Discounted plan for students');

-- -- Schedule (using MemberID and TrainerID from above)
-- -- Note: TrainerID is not in your current schema, I'll use TrainerName as per your schema
-- INSERT INTO Schedule (MemberID, TrainerName, DayOfWeek, TimeSlot)
-- SELECT M.MemberID, T.Name, 'Monday', '08:00 - 09:00'
-- FROM Member M, Trainer T
-- WHERE M.Name = 'John Doe' AND T.Name = 'Alice Trainer'
-- ON CONFLICT DO NOTHING;

-- INSERT INTO Schedule (MemberID, TrainerName, DayOfWeek, TimeSlot)
-- SELECT M.MemberID, T.Name, 'Tuesday', '10:00 - 11:00'
-- FROM Member M, Trainer T
-- WHERE M.Name = 'Jane Smith' AND T.Name = 'Bob Fit'
-- ON CONFLICT DO NOTHING;

-- -- Attendance
-- INSERT INTO Attendance (MemberID, CheckInDate)
-- SELECT MemberID, '2025-05-01' FROM Member WHERE Name = 'John Doe' ON CONFLICT DO NOTHING;
-- INSERT INTO Attendance (MemberID, CheckInDate)
-- SELECT MemberID, '2025-05-02' FROM Member WHERE Name = 'Jane Smith' ON CONFLICT DO NOTHING;
-- INSERT INTO Attendance (MemberID, CheckInDate)
-- SELECT MemberID, '2025-05-03' FROM Member WHERE Name = 'John Doe' ON CONFLICT DO NOTHING;


-- -- Payments (UPDATED to include PlanID and PaymentMethod)
-- INSERT INTO Payment (MemberID, Amount, PaymentDate, DueDate, PaymentStatus, PlanID, PaymentMethod)
-- SELECT M.MemberID, 49.99, '2025-05-01', '2025-06-01', 'Paid', P.PlanID, 'Card'
-- FROM Member M, Plan P
-- WHERE M.Name = 'John Doe' AND P.PlanName = 'Basic Plan'
-- ON CONFLICT DO NOTHING;

-- INSERT INTO Payment (MemberID, Amount, PaymentDate, DueDate, PaymentStatus, PlanID, PaymentMethod)
-- SELECT M.MemberID, 129.99, '2025-04-15', '2025-07-15', 'Paid', P.PlanName = 'Standard Plan', 'UPI'
-- FROM Member M, Plan P
-- WHERE M.Name = 'Jane Smith' AND P.PlanName = 'Standard Plan'
-- ON CONFLICT DO NOTHING;


-- -- Feedback
-- INSERT INTO Feedback (MemberID, Name, Email, Message, SubmittedAt)
-- SELECT M.MemberID, M.Name, u.emailid, 'Great training!', '2025-05-10'
-- FROM Member M
-- JOIN users u ON M.MemberID = u.id
-- WHERE M.Name = 'John Doe'
-- ON CONFLICT DO NOTHING;

-- INSERT INTO Feedback (MemberID, Name, Email, Message, SubmittedAt)
-- SELECT M.MemberID, M.Name, u.emailid, 'Very helpful.', '2025-05-11'
-- FROM Member M
-- JOIN users u ON M.MemberID = u.id
-- WHERE M.Name = 'Jane Smith'
-- ON CONFLICT DO NOTHING;


-- -- Reports
-- INSERT INTO Report (ReportType, SQLQuery)
-- VALUES
-- ('Payment Summary', 'SELECT MemberID, SUM(Amount) FROM Payment GROUP BY MemberID;'),
-- ('Attendance Report', 'SELECT MemberID, COUNT(*) FROM Attendance GROUP BY MemberID;'),
-- ('Trainer Feedback', 'SELECT TrainerID, AVG(Rating) FROM Feedback GROUP BY TrainerID;'),
-- ('Active Members', 'SELECT * FROM Member WHERE MembershipStatus = ''Active'';'),
-- ('Due Payments', 'SELECT * FROM Payment WHERE PaymentStatus = ''Unpaid'';');
