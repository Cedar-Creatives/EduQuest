const { auth } = require('../../config/firebase');

const requireUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);
    
    // Add user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      name: decodedToken.name,
      picture: decodedToken.picture
    };

    next();
  } catch (error) {
    console.error('Firebase auth error:', error);
    return res.status(401).json({ 
      success: false,
      message: 'Invalid or expired token' 
    });
  }
};

const requirePremium = async (req, res, next) => {
  try {
    // First ensure user is authenticated
    await requireUser(req, res, async () => {
      // Get user subscription status from Firestore
      const { db } = require('../../config/firebase');
      const userDoc = await db.collection('users').doc(req.user.uid).get();
      
      if (!userDoc.exists) {
        return res.status(404).json({ 
          success: false,
          message: 'User not found' 
        });
      }

      const userData = userDoc.data();
      if (userData.subscriptionStatus !== 'premium') {
        return res.status(403).json({ 
          success: false,
          message: 'Premium subscription required' 
        });
      }

      next();
    });
  } catch (error) {
    console.error('Premium check error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error checking subscription status' 
    });
  }
};

module.exports = {
  requireUser,
  requirePremium
};
