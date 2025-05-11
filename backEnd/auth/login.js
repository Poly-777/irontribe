export const loginUser = (req, res) => {
  const { emailid, password } = req.body;

  // Dummy login check
  if (emailid === 'test@example.com' && password === 'Test@1234') {
    return res.status(200).json({ message: 'Login successful', user: { emailid } });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
};
