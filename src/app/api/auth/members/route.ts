
import { NextApiRequest, NextApiResponse } from 'next';
import {pool} from '../../../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { name, email, password, phone, address, dob, gender } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO Member (Name, Email, Phone, Address, DOB, Gender, JoinDate, MembershipStatus, TermsAccepted)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE, 'Active', TRUE) RETURNING *`,
      [name, email, phone, address, dob, gender]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
