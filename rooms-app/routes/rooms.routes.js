const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const Room = require('../models/Room.model')


//create room route

router.get("/create", (req, res) => {
    res.render("rooms/create")
})

router.post("/create", (req, res) => {
    const { name, description, imageUrl } = req.body

 // make sure users fill all mandatory fields:
 if (!name || !description || !imageUrl) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your name, description and imageUrl.' });
    return;
  }

  Room.create({name, description, imageUrl})

})



module.exports = router;