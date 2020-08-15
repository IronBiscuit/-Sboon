const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth');
const User = require('../models/User');

router.get('/', ensureAuthenticated, (req, res) => {
    var player = req.user;
    res.render('dashboard', {
        user: player
    })
})

module.exports = router