// following usercontroller setup to setup similarly
//assuming the itinerary is only saved if person is user
const History = require('../models/History');
const User = require('../models/User');
//find user, add history, let us know history added
//history not added, let us know error
exports.addHistory = async (req, res) => {
    try {
        const { location, itinerary } = req.body;
        const userId = req.session.user.id;
        
        // add history entry to "array"
        const history = new History({
            userId,
            location,
            itinerary,
        });

        await history.save();

        //https://www.geeksforgeeks.org/mongoose-findbyidandupdate-function/
        await User.findByIdAndUpdate(userId, { $push: { history: history._id } });

        //noted from userController
        console.log('History added successfully.');

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
//locate itinerary-> delete->let us know deleted
//not deleted-> error
exports.deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;
    
    //find &delete
    const itinerary= await History.findByIdAndDelete(id);

    if (!itinerary) {
      console.error('not deleted');
      return res.status(404).send('histroyController: itinerary not found.');
    }

    //debugging because wtf
    console.log('Delete success:');
    
    res.redirect('/user/profile');
  } catch (error) {
    console.error('historyControlle - deletion error:', error.message);
    res.status(500).send('Server Error');
  }
};