import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic input validation
    if (!username || !password || !confirmPassword || !email || !phone || !address) {
      setError('Please fill in all fields.');
      return;
    }

    // Password strength validation (adjust as needed)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter and one number.');
      return;
    }

    // Email validation (basic regex, consider using a library for more robust validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email address.');
      return;
    }
    
    // Assuming valid input, proceed with registration
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username,
          password,
          email,
          phone,
          address
        })
      });

      const data = await response.json();
      setLoggedIn(data.loggedIn);
      setError(data.error);
    } catch (error) {
      console.error('Error registering:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="usercred-box">
      {loggedIn && <Navigate to="/" replace={true} />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="usercred-title">Book Buddy</div>
      <form className="usercred-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="username" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="confirm password" name="passwordconfirm" id="passwordconfirm" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <input type="email" placeholder="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="phone" placeholder="phone number" name="phone" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input type="text" placeholder="address" name="address" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
        <input type="submit" value="Register" />
      </form>
    </div>
  );
};

export default Register;