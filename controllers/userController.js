/**
 * User Controller
 * Handles logic for user-related pages and actions
 */
const User = require('../models/User');
const Image = require('../models/Image');
const upload = require('../middlewares/upload');
const History =require('../models/History');

exports.getProfile = async (req, res) => {
  // Add hasProfileImage flag to user object
  //const user = {...req.session.user};
  try {
    // followed get settings logic from profs example
    const userId = req.session.user.id;
          
    // all previously saved itineraries in user database- history
    const user = await User.findById(userId).populate('history');

    if (!user) {
      return res.status(404).render('404', { message: 'USERcontroller: getProfile: User not found' });
    }
    //for now load all history with profile
    //Possibly: drop down menu with each location/date as title
    // then expand to see itinerary(?)
    res.render('user/profile', {
      title: 'Profile',
      user: user,
      history: user.history
    });
  } catch (error) {
    // const error = new Error('User not found');
    //         error.statusCode = 404;
    //         throw error;
    console.error('error handling profile:', error.message);
    res.status(500).send('profile error');
    
  }
};

/**
 * Display user settings page
 */
exports.getSettings = (req, res) => {
  res.render('user/settings', {
    title: 'Settings',
    user: req.session.user,
    errors: []
  });
};

/**
 * Update user settings
 */
exports.updateSettings = [
  // Use multer middleware to handle file upload
  // We need to handle errors from multer separately
  async (req, res, next) => {
    try {
      upload.single('profileImage')(req, res, async (err) => {
        if (err) {
          // Handle file upload error
          return res.status(400).render('user/settings', {
            title: 'Settings',
            user: req.session.user,
            errors: [{ msg: err.message || 'File upload error' }]
          });
        }
        
        try {
          // Get user ID from session
          const userId = req.session.user.id;
          
          // Find user in database
          const user = await User.findById(userId);
          
          if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
          }
          
          // Update username if provided and different
          if (req.body.username && req.body.username !== user.username) {
            // Check if username is already taken
            const existingUser = await User.findOne({ username: req.body.username });
            if (existingUser && existingUser._id.toString() !== userId) {
              return res.status(400).render('user/settings', {
                title: 'Settings',
                user: req.session.user,
                errors: [{ msg: 'Username is already taken' }]
              });
            }
            
            user.username = req.body.username;
            // Update session data
            req.session.user.username = req.body.username;
          }
          //update Fullname if provided and different
          if (req.body.fullname && req.body.fullname !== user.fullname){
            user.fullname = req.body.fullname;
            // Update session data
            req.session.user.fullname = req.body.fullname;
          }
          //update User Age
          if (req.body.age && req.body.age !== user.age){
            user.age = req.body.age;
            // Update session data
            req.session.user.age = req.body.age;
          }
          // Process profile image if uploaded
          if (req.file) {
            try {
              // Check if user already has a profile image
              const existingImage = await Image.findOne({ userId: userId });
              
              if (existingImage) {
                // Update existing image
                existingImage.data = req.file.buffer;
                existingImage.contentType = req.file.mimetype;
                await existingImage.save();
              } else {
                // Create new image document
                const newImage = new Image({
                  userId: userId,
                  data: req.file.buffer,
                  contentType: req.file.mimetype
                });
                await newImage.save();
                
                // Update user to indicate they have a profile image
                user.hasProfileImage = true;
              }
              
              // Update session to indicate user has a profile image
              req.session.user.hasProfileImage = true;
            } catch (imageError) {
              console.error('Error handling profile image:', imageError);
              return res.status(500).render('user/settings', {
                title: 'Settings',
                user: req.session.user,
                errors: [{ msg: 'Error saving profile image' }]
              });
            }
          }
          
          // Save changes
          await user.save();
          
          // Render settings page with success message
          res.render('user/settings', {
            title: 'Settings',
            user: req.session.user,
            errors: [],
            flashMessage: {
              type: 'success',
              text: 'Settings updated successfully'
            }
          });
        } catch (error) {
          next(error);
        }
      });
    } catch (error) {
      next(error);
    }
  }
];

/**
 * Get current user's profile image
 */
exports.getProfileImage = async (req, res, next) => {
  try {
    // Get user ID from session
    const userId = req.session.user.id;
    
    // Find image in database
    const image = await Image.findOne({ userId: userId });
    
    if (!image || !image.data) {
      return res.status(404).send('Image not found');
    }
    
    // Set the content type header and send the image data
    res.set('Content-Type', image.contentType);
    res.send(image.data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get any user's profile image by ID
 */
exports.getUserProfileImage = async (req, res, next) => {
  try {
    // Get user ID from params
    const userId = req.params.userId;
    
    // Find image in database
    const image = await Image.findOne({ userId: userId });
    
    if (!image || !image.data) {
      return res.status(404).send('Image not found');
    }
    
    // Set the content type header and send the image data
    res.set('Content-Type', image.contentType);
    res.send(image.data);
  } catch (error) {
    next(error);
  }
};