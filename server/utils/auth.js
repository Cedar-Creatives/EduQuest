const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  console.log('=== GENERATING ACCESS TOKEN ===');
  console.log('User object received:', {
    _id: user._id,
    username: user.username,
    email: user.email
  });
  
  const payload = {
    sub: user._id.toString()
  };
  
  console.log('Access token payload:', payload);
  
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log('Access token generated successfully');
    
    // Verify the token was created correctly
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Access token verification:', decoded);
    
    return token;
  } catch (error) {
    console.error('Error generating access token:', error.message);
    throw new Error('Failed to generate access token');
  }
};

const generateRefreshToken = (user) => {
  console.log('=== GENERATING REFRESH TOKEN ===');
  console.log('User object received:', {
    _id: user._id,
    username: user.username,
    email: user.email
  });
  
  const payload = {
    sub: user._id.toString()
  };
  
  console.log('Refresh token payload:', payload);
  
  try {
    const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
    console.log('Refresh token generated successfully');
    
    // Verify the token was created correctly
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    console.log('Refresh token verification:', decoded);
    
    return token;
  } catch (error) {
    console.error('Error generating refresh token:', error.message);
    throw new Error('Failed to generate refresh token');
  }
};

const verifyAccessToken = (token) => {
  console.log('=== VERIFYING ACCESS TOKEN ===');
  console.log('Token to verify:', token);
  
  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is not set');
      throw new Error('JWT_SECRET not configured');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Access token verified successfully:', decoded);
    
    if (!decoded.sub) {
      console.error('Token missing sub field:', decoded);
      throw new Error('Invalid token: missing user ID');
    }
    
    return decoded;
  } catch (error) {
    console.error('Access token verification failed:', error.message);
    throw error;
  }
};

const verifyRefreshToken = (token) => {
  console.log('=== VERIFYING REFRESH TOKEN ===');
  console.log('Token to verify:', token);
  
  try {
    if (!process.env.REFRESH_TOKEN_SECRET) {
      console.error('REFRESH_TOKEN_SECRET environment variable is not set');
      throw new Error('REFRESH_TOKEN_SECRET not configured');
    }
    
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    console.log('Refresh token verified successfully:', decoded);
    
    if (!decoded.sub) {
      console.error('Token missing sub field:', decoded);
      throw new Error('Invalid token: missing user ID');
    }
    
    return decoded;
  } catch (error) {
    console.error('Refresh token verification failed:', error.message);
    throw error;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};