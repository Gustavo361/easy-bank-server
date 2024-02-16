const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const bodyParser = require('body-parser')
const UserModel = require('./db/userModel')
const flash = require('connect-flash')
const dbconfig = require('./config/db')
const bcrypt = require('bcrypt')
const cors = require('cors')
const createAccount = require('./create-account')
const loginAccount = require('./login-account')
const localStrategy = require('./localStrategy')
const checkAuthentication = require('./checkAuth')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({origin: process.env.CORS_ORIGIN}))
// app.use(cors({ origin: '*' }))

app.use(require('express-session')({ secret: 'secretpassphrase', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.json())
app.use(flash())
app.use(bodyParser.urlencoded({ extended: true }))
passport.use(localStrategy)

app.get('/', checkAuthentication, (req, res) => {
    res.redirect('https://easy-bank-ui.onrender.com')
})

app.get('/create-account', checkAuthentication, (req, res) => {
    res.redirect('http://127.0.0.1:5500/create-account.html')
})

app.post('/create-account', createAccount)

app.post('/login', loginAccount)

app.get('/login', (req, res) => {
    res.redirect('https://easy-bank-ui.onrender.com/login')
})

app.get('/test', (req, res) => {
    res.send('backend here!')
})

passport.serializeUser(function (user, done) {
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    UserModel.findById(id, function (err, user) {
        done(err, user)
    })
})

app.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            return res.status(500).json({ error: 'Erro ao fazer logout.' })
        }
        res.redirect('http://localhost:5500/')
    })
})

mongoose.connect(dbconfig.databaseConnectionString)

app.listen(PORT, () => {
    console.log(`server's running at http://localhost:${PORT}`)
})