import { v4 as uuidv4 } from 'uuid';

app.post('/signup', async (req, res) => {
  const id = uuidv4(); // generate unique member ID
  const { name, email } = req.body;

  await db.query('INSERT INTO members (member_uuid, name, email) VALUES ($1, $2, $3)', [
    id,
    name,
    email,
  ]);

  res.status(200).json({ message: 'User created', id });
});

// npm install uuid
// npm install pg
// npm install dotenv

// CREATE TABLE members (
//   id SERIAL PRIMARY KEY,
//   member_uuid UUID DEFAULT gen_random_uuid(),
//   name TEXT NOT NULL,
//   email TEXT UNIQUE NOT NULL
// );
// // CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
// // CREATE EXTENSION IF NOT EXISTS "pgcrypto";