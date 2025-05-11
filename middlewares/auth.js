/**
 * Authentication middleware
 * Provides functions to protect routes that require authentication
 */

// Middleware to check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
  console.log('Session check - session exists:', !!req.session);
  console.log('Session check - user in session:', !!req.session.user);
  console.log('Current session:', req.session);
  
  if (req.session && req.session.user) {
    console.log('User is authenticated, proceeding to next middleware');
    // User is authenticated, proceed to the next middleware
    return next();
  }
  
  console.log('User is not authenticated, redirecting to login');
  // User is not authenticated, redirect to login page
  if (req.session) {
    req.session.returnTo = req.originalUrl; // Store the URL they were trying to access
  }
  res.redirect('/auth/login');
};

// Middleware to check if user is NOT authenticated
// Used for routes like login/register that should be inaccessible to logged-in users
exports.isNotAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    // User is not authenticated, proceed to the next middleware
    return next();
  }
  
  // User is already authenticated, redirect to profile page
  res.redirect('/user/profile');
};