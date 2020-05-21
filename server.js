if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const {MongoClient} = require('mongodb')
const indexRouter = require('./routes/index')
const registerRouter = require('./routes/register')
const loginRouter = require('./routes/login')
const gameRouter = require('./routes/game')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const server = require('http').Server(app)
var io = require('socket.io')(server, {})
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended : false }))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))
app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/game', gameRouter);
server.listen(process.env.PORT || 3000);
console.log("Server started.");

db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to mongoose'))








