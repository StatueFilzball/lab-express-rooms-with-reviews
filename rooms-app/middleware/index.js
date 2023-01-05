const Room = require('../models/Room.model')


// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
    if (req.session.currentUser) {
        next(); // execute the next action for this route
    }
    else {
        return res.redirect('/auth/login');
    }
  
};
   
  // if an already logged in user tries to access the login page it
  // redirects the user to the home page
 

  const isOwner = (req, res, next) => {
    const roomId = req.params
    const userId = req.session.currentUser._id

    Room.findById(roomId)
      .then((foundRoom) => {
        const roomOwner = foundRoom.owner
        if (roomOwner === userId){
          next()
        }
      })
    
  //   if(req.session.currentUser._id === req.params) {
  //     next ()
  //   }
  //   else {
  //     return res.redirect('/rooms/all-rooms');
  // }
  }

  const isNotOwner = (req, res, next) => {
    if(req.session.currentUser && req.session.currentUser._id != req.params) {
      next ()
      
    }
    else {
      return res.redirect('/rooms/all-rooms');
      }
  }
   
  module.exports = {
    isLoggedIn,
    isOwner,
    isNotOwner
  };