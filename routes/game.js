const express = require('express')
const app = express()

const { handleError, ErrorHandler } = require('../models/error')


module.exports = function(io) {
    const router = express.Router()
    var currentName;
    var SOCKET_LIST = {}
    var initPack = {player: []};
    var removePack = {player: []};
    

router.get('/', (req, res) => {
    currentName = req.query.valid
    console.log(currentName)
    res.render('game', {
        name: currentName
    })
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});

var Entity = function() {
    var self = {
        x: 250,
        y: 250,
        spdX: 0,
        spdY: 0,
        name: "",
    }
    self.updatePosition = function () {
        self.x += self.spdX;
        self.y += self.spdY;
    }
    return self;
}

var Player = function(name, id) {
    var self = Entity();
    self.name = name;
    self.pressingRight = false;
    self.pressingLeft = false;
    self.pressingUp = false;
    self.pressingDown = false;
    self.maxSpeed = 3;
    self.id = id;
    self.updateSpd = function() {
        if (self.pressingRight) {
            self.spdX = self.maxSpeed;
        } else if (self.pressingLeft) {
            self.spdX = -self.maxSpeed;
        } else {
            self.spdX = 0;
        }
        if (self.pressingUp) {
            self.spdY = -self.maxSpeed;
        } else if (self.pressingDown) {
            self.spdY = self.maxSpeed;
        } else {
            self.spdY = 0;
        }
    }
    self.update = function() {
        self.updateSpd();
        self.updatePosition();
    }
    Player.list[id] = self;
    return self;
}
Player.list = {};
Player.onConnect = function(socket) {
    var player = Player(socket.name, socket.id);
    for (var i in Player.list) {
        initPack.player.push(Player.list[i]);
    }
    for(var i in SOCKET_LIST) {
       var socketed = SOCKET_LIST[i];
       socketed.emit('init', initPack);
    }
    initPack.player = [];
    socket.on('keyPress', function(data) {
        if (data.input === 'left') {
            player.pressingLeft = data.state;
        } else if (data.input === 'right') {
            player.pressingRight = data.state;
        } else if (data.input === 'up') {
            player.pressingUp = data.state;
        } else if (data.input === 'down') {
            player.pressingDown = data.state;
        }
    });
    socket.on('sendMsgToServer', function(data) {
        var name = data.name;
        var message = data.msg;
        var finalMessage = name + ": " + message;
        for(var i in SOCKET_LIST) {
            SOCKET_LIST[i].emit('addToChat', finalMessage);
        }
    })
}
Player.onDisconnect = function(socket) {
    removePack.player.push(Player.list[socket.id]);
    for (var i in SOCKET_LIST) {
        var socketed = SOCKET_LIST[i];
        socketed.emit('remove', removePack);
    }
    removePack.player = [];
    delete Player.list[socket.id];
}
Player.update = function() {
    var pack = [];
        for(var i in Player.list) {
            var player = Player.list[i];
            player.update();
            pack.push({
                x:player.x,
                y:player.y,
                name:player.name,
                id: player.id
            })
        }
    return pack;
}
io.sockets.on('connection', function(socket) {
        console.log('socket connection')
        var identity = Math.random();
        socket.id = identity;
        socket.name = currentName;
        SOCKET_LIST[socket.id] = socket;
        Player.onConnect(socket);
        socket.on('disconnect', function(){
            delete SOCKET_LIST[socket.id]
            Player.onDisconnect(socket)
        });  
});

    setInterval(() => {
        var pack = Player.update();
        for (var i in SOCKET_LIST) {
            var socket = SOCKET_LIST[i];
            socket.emit('update', pack)
        }
    }, 1000/65);

    return router;
}






