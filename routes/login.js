const express = require('express')
const router = express.Router()
const { handleError, ErrorHandler } = require('../models/error')
const Bcrypt = require("bcryptjs")
const passport = require('passport');
const { forwardAuthenticated } = require('../config/auth');


router.get('/', forwardAuthenticated, (req, res) => {
    res.render('login/index')
})

router.post('/', async (req, res, next) => {
    try {
        passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/login',
            failureFlash: true
          })(req, res, next);
    } catch (error) {
        res.render('login/test', {
            errorMessage: error
        })
        console.log(error)
    }
})

module.exports = router