// following usercontroller setup to setup similarly
//assuming the itinerary is only saved if person is user
const History = require('../models/History');
const User = require('../models/User');

exports.addHistory = async (req, res) => {
    try {
        const { location, itinerary } = req.body;
        const userId = req.session.user.id;
        
        // add history entry to array
        const history = new History({
            userId,
            location,
            itinerary,
        });

        await history.save();

        //https://www.geeksforgeeks.org/mongoose-findbyidandupdate-function/
        await User.findByIdAndUpdate(userId, { $push: { history: history._id } });

        // Noted from userController updateSettings
        req.session.flashMessage = {
            type: 'success',
            text: 'History entry added successfully!',
        };

        res.redirect('/user/profile');
    } catch (err) {
        console.error('Error adding history:', err);
        req.session.flashMessage = {
            type: 'error',
            text: 'An error occurred while adding history.',
        };
        res.redirect('/user/profile');
    }
};

