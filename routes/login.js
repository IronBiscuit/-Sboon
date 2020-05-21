const express = require('express')
const router = express.Router()
const newPlayer = require('../models/newPlayer')
const { handleError, ErrorHandler } = require('../models/error')
const Bcrypt = require("bcryptjs")


router.get('/', (req, res) => {
    console.log("reached login")
    res.render('login/index', {newPlayer: new newPlayer()})
})

router.post('/', async (req, res) => {
    
    try {
        const currentPlayer = await newPlayer.findOne({name: req.body.name});
        if (!currentPlayer) {
            throw new ErrorHandler(400, "Invalid credentials!")
        } else if (!Bcrypt.compareSync(req.body.password, currentPlayer.password)) {
            throw new ErrorHandler(300, "Username/Password is incorrect")
        } else {
            var string = encodeURIComponent(req.body.name)
            res.redirect('game/?valid=' + string)
        }
    } catch (error) {
        res.render('login', {
            player: new newPlayer(),
            errorMessage: error
        })
        console.log(error)
    }
})

module.exports = router