/**
 * Main application entry point
 * This file sets up our Express server, middleware, and routes
 */

// Load environment variables from .env file
require('dotenv').config();

// Core dependencies
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const csrf = require('csurf');

// Import routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// Import custom middleware
const { setLocals } = require('./middlewares/locals');
const { handleErrors } = require('./middlewares/error-handler');

// Initialize Express app
const app = express();

// Connect to MongoDB (with error handling that doesn't crash the app)
if (process.env.MONGODB_URI) {
    // Completely disable indexing in Mongoose
    mongoose.set('autoIndex', false);
    mongoose.set('autoCreate', false);

    // Set Mongoose options to handle MongoDB version differences
    const mongooseOptions = {
        // For older MongoDB servers and compatibility
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4 // Use IPv4, skip trying IPv6
    };

    mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
        .then(() => console.log('MongoDB connected successfully'))
        .catch(err => {
            console.error('MongoDB connection error:', err);
            console.log('Continuing without MongoDB. Some features may not work.');
        });
} else {
    console.log('No MONGODB_URI found in environment. Continuing without database connection.');
    console.log('Please set up your MongoDB connection in the .env file to enable authentication features.');
}

// Configure Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Helper function for error responses
app.locals.helpers = {
    isActiveRoute: (path, route) => path === route,
    currentYear: () => new Date().getFullYear(),
    formatDate: (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
};

// Session configuration
let sessionConfig = {
    secret: process.env.SESSION_SECRET || 'fallback-secret-for-development',
    resave: true, // Changed to true to ensure session is saved
    saveUninitialized: true, // Changed to true to create session for all users
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: false, // Disabled secure requirement temporarily
        sameSite: 'lax' // Always use lax which works better in most environments
    }
};


// If you want to try using MongoDB store, uncomment this:
try {
    if (process.env.MONGODB_URI) {
        // Create the session store with more reliable options
        sessionConfig.store = MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
            ttl: 14 * 24 * 60 * 60, // = 14 days session expiry
            autoRemove: 'native',
            touchAfter: 60, // Update session every minute
            crypto: {
                secret: false // disable encryption
            },
            // Add error logging for any session store issues
            collectionName: 'sessions', // Use explicit collection name
            stringify: false, // Don't stringify session data (more reliable)
        });

        // Add event listeners to the session store to debug connection issues
        const store = sessionConfig.store;

        store.on('create', (sessionId) => {
            console.log('New session created:', sessionId);
        });

        store.on('touch', (sessionId) => {
            console.log('Session touched:', sessionId);
        });

        store.on('error', (error) => {
            console.error('Session store error:', error);
        });

        console.log('MongoDB session store configured with debug logging');
    } else {
        console.log('Using memory session store (not recommended for production)');
    }
} catch (error) {
    console.error('Error configuring MongoDB session store:', error);
    console.log('Falling back to memory session store (not recommended for production)');
}

app.use(session(sessionConfig));

// CSRF protection disabled temporarily
console.log('CSRF protection is currently disabled');

// Set a dummy CSRF token for templates
app.use((req, res, next) => {
    // Provide a dummy token so templates don't break
    res.locals.csrfToken = 'csrf-protection-disabled';
    next();
});

// Our custom locals middleware
app.use(setLocals);

// Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// Error handling middleware
app.use(handleErrors);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});