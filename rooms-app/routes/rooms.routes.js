const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const Room = require('../models/Room.model')
const Review = require('../models/Review.model')


const { isLoggedIn } = require('../middleware');
const { isOwner } = require('../middleware');
const { isNotOwner } = require('../middleware');


const { route } = require('./auth.routes');

//create room route

router.get("/create", isLoggedIn, (req, res) => {
    res.render("rooms/create")
})


router.post("/create", (req, res) => {
    const { name, description, imageUrl } = req.body
    const owner = req.session.currentUser._id
    
    if (!name || !description || !imageUrl) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your name, description and imageUrl.' });
        return;
      }

      Room.create({name, description, imageUrl, owner})
      .then(()=> res.redirect('/rooms/all-rooms'))
      .catch(err => console.log(err))
})



router.get('/:id/edit', isOwner, (req, res, next) => {

      const {id} = req.params

    Room.findById(id)

      .then(foundRoom => res.render('rooms/update-form', foundRoom))
      .catch(err => console.log(err))
    
  });

router.post('/:id/edit', (req, res, next) => {
    const {name, description, imageUrl, owner} = req.body
    const {id} = req.params
    Room.findByIdAndUpdate(id, {name, description, imageUrl, owner})
    .then(() => res.redirect("/rooms/all-rooms"))
    .catch(err => console.log(err))
})

router.get("/all-rooms", (req, res) => {
    Room.find()
        .then(rooms => res.render("rooms/all-rooms", { rooms }))
        .catch(err => console.log(err))
})


router.post('/:id/delete', (req, res, next) => {
    const { id } = req.params;
  
    Room.findByIdAndDelete(id)
        .then(() => res.redirect('/rooms/all-rooms'))
        .catch(err => console.log(err))
  });


  //get the room review page
  router.get('/:id/write-review', isLoggedIn, isNotOwner, (req, res, next) => {

    const {id} = req.params

  Room.findById(id)

    .then(foundRoom => res.render('rooms/review-form', foundRoom))
    .catch(err => console.log(err))
  
});


//put the review in the database
//mark the owner id on the review
//add review to room database entry
router.post('/:id/write-review', (req, res, next) => {

    const {comment} = req.body
    const userId = req.session.currentUser._id
    const {roomId} = req.params
    console.log("USER ID", userId)

    if (!comment) {
        res.render('/:id/write-review', { errorMessage: 'Please write a comment before sending the form.' });
        return;
      }

      Review.create({user: userId, comment})
        .then((newReview) => {
            Room.findById(roomId)
                .then((reviewedRoom) => {
                    reviewedRoom.reviews.push(newReview._id) 
                    reviewedRoom.save()
                })
                .catch(err => console.log(err))
        })
        .then(() => res.redirect('/rooms/all-rooms'))
        .catch(err => console.log(err))

});

module.exports = router;