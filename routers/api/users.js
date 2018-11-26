// @login & register
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const keys = require("../../config/keys");
const passport = require("passport");

const User = require("../../models/User");

// $route   GET api/users/test
// @desc    return json data
// @access  Public   
router.get("/test", (req, res) => {
    res.json({msg:"login works!"})
})

// $route   POST api/users/register
// @desc    return json data
// @access  Public   
router.post("/register", (req, res) => {
    //console.log(req.body);

    // check db has the same email
    User.findOne({email:req.body.email}).then((user) => {
        if (user) {
            return res.status(400).json("Email has been registed");
        } else {
            const avatar = gravatar.url(req.body.password, {s: '200', r: 'pg', d: 'mm'});

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password,
                identity: req.body.identity
            })

            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, (err,salt) => {   
                bcrypt.hash(newUser.password, salt, (err, hash) => {   
                    if (err) {
                        throw err;
                    }

                    newUser.password = hash;

                    newUser.save()
                           .then(user => res.json(user))
                           .catch(err => console.log(err));
                });
            });
        }
    })
})

// $route   POST api/users/login
// @desc    return token jwt passport 
// @access  Public  
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
         .then(user => {
             if (!user) {
                 return res.status(404).json("No user!");
             } 
             
             // check password
             bcrypt.compare(password, user.password)
                   .then((isMatch) => {
                        if (isMatch) {
                            const rule = {
                                id: user.id, 
                                name: user.name,
                                avatar: user.avatar,
                                identity: user.identity
                            };
                            jwt.sign(rule, keys.secretOrKey, {expiresIn:3600}, (err, token) => {
                                if (err) {
                                    throw err;
                                }

                                res.json({
                                    success: true,
                                    token: "Bearer " + token
                                });
                            });
                        } else {
                            return res.status(404).json("Wrong password")
                        }
                   })
                   .catch(err => console.log(err));
         })
})

// $route   GET api/users/current
// @desc    return current user
// @access  Private
router.get("/current", passport.authenticate("jwt", {session: false}), (req,res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
    });
})

module.exports = router;