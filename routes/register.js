const express = require('express')
const router = express.Router()
const newPlayer = require('../models/newPlayer')
const { handleError, ErrorHandler } = require('../models/error')
const Bcrypt = require("bcryptjs")

router.get('/', (req, res) => {
    res.render('register/index', {player: new newPlayer()})
})


router.post('/', async (req, res) => {
    let player = new newPlayer()
    try {
        player = new newPlayer({
            name: req.body.name,
            email: req.body.email,
            password: await Bcrypt.hash(req.body.password, 10)
        })
        const currentPlayer = await newPlayer.find({email: req.body.email})
        if (currentPlayer.length > 0) {
            throw new ErrorHandler(401, "Email is already taken!")
        } else {
            const anotherPlayer = await player.save()
            res.redirect('login')
        }
        
        
    } catch (error) {
        res.render('register', {
            player: player,
            errorMessage: error
        })
    }
    console.log(error)
})

module.exports = router