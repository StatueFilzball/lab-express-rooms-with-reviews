const bcrypt = require("bcrypt")
const router = require("express").Router();
const saltRounds = 10;

const User = require('../models/User.model');

//signup get route
router.get("/signup", (req, res) => {
    res.render("auth/signup")
})

//signup post routes
router.post("/signup", async (req, res) => {
    const { email, password, fullName} = req.body

if(!email || !password || !fullName) {
    res.render("auth/signup", {errorMessage: "All fields are mandatory. Try again."})
    return
}

//password strength check
const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
if(!regex.test(password)) {
    res
        .status(500)
        .render("auth/signup", {errorMessage: "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter."})
    return
    }
    const passwordHash = await bcrypt.hash(password, saltRounds)

    //creating the user in the DB after all checks
    User.create({email, password: passwordHash, fullName})
        .then((newUser) => {
            req.session.currentUser = {email: newUser.email, fullName}
            console.log("REQ CURRENT USER",req.session.currentUser)
            res. redirect("/auth/profile")
        })
        .catch(err => console.log(err))
})


//login route

router.get("/login", (req, res) => {
    console.log("Session ID", req.session.id)
    res.render("auth/login")
})

router.post('/login', (req, res) => {
    console.log('SESSION =====> ', req.session);
    const { email, password } = req.body;
    console.log('req.body', req.body)
//    Data validation check 
  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }

  User.findOne({ email })
    .then(user => {
        console.log("user:", user)
    if(!user) {
        res.render("auth/login", {errorMessage: "Email is not registered. Try again."})
        return
    } else if(bcrypt.compareSync(password, user.password)) {
        // const { email } = user
        // req.session.currentUser = { email }
       
       
        const { _id, fullName } = user
        req.session.currentUser = { _id }
        console.log("USER ID", user)
        res.redirect("/auth/profile")
    }
    })
.catch(err => console.log(err))
})

//profile page
router.get('/profile', (req, res) => {
    console.log("REQ SESSION CURRENT USER", req.session.currentUser._id)
    res.render('auth/profile', req.session.currentUser)
})

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) console.log(err);
      res.redirect('/');
    });
  });

module.exports = router;