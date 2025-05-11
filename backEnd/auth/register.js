export const registerUser = (req, res) => {
  const { emailid, password } = req.body;

  // Dummy registration check
  if (emailid && password) {
    return res.status(201).json({ message: 'Registration successful', user: { emailid } });
  } else {
    return res.status(400).json({ message: 'Invalid data' });
  }
};