
require('dotenv').config()

const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const express = require('express');
const app = express();
const indexRouter = require('./routes/index')
const registerRouter = require('./routes/register')
const loginRouter = require('./routes/login')
const gameRouter = require('./routes/game')
const dashboardRouter = require('./routes/dashboard')
const bodyParser = require('body-parser')

//for sockets.io
const server = require('http').Server(app)
var io = require('socket.io')(server, {})

// Passport Config
require('./config/passport')(passport);


// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to mongoose'))

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout');

// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/game', gameRouter);
app.use('/dashboard', dashboardRouter);

server.listen(process.env.PORT || 3000);
console.log("Server started.");










