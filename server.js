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
const methodOverride = require('method-override')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }))
app.use(cors({ origin: '*', credentials: true }))

app.use(require('express-session')({
    secret: 'secretpassphrase',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        sameSite: 'none'
    }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.json())
app.use(flash())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
passport.use(localStrategy)

app.get('/', checkAuthentication, (req, res) => {
    res.redirect('https://easy-bank-ui.onrender.com')
})

app.get('/create-account', checkAuthentication, (req, res) => {
    res.redirect('https://easy-bank-ui.onrender.com/create-account.html')
})

app.post('/create-account', createAccount)

app.post('/login', loginAccount)

app.get('/login', (req, res) => {
    res.redirect('https://easy-bank-ui.onrender.com/login')
})

app.get('/initial', checkAuthentication, (req, res) => {
    res.redirect('https://easy-bank-ui.onrender.com/initial.html')
})

app.post('/initial', checkAuthentication, async (req, res) => {
    try {
        const user = await UserModel.findById(req.session.passport.user)

        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado' })
        }
        res.json({ userName: user.userName })
    } catch (error) {
        console.error('Erro ao buscar usuário no MongoDB Atlas:', error)
        res.status(500).json({ error: 'Erro ao buscar usuário' })
    }
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
    req.logout(err => {
        if (err) return next(err)
        res.json({ ok: true, redirectUrl: 'https://easy-bank-ui.onrender.com' })
    })
})

mongoose.connect(dbconfig.databaseConnectionString)

app.listen(PORT, () => {
    console.log(`server's running at http://localhost:${PORT}`)
})