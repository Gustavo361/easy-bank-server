const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const bodyParser = require('body-parser')
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('./db/userModel')
const flash = require('connect-flash')
const config = require('./config/db')
const bcrypt = require('bcrypt')
const cors = require('cors')
const { isValidName, isValidEmail, isValidPassword } = require('./db/validation')

const app = express()
const PORT = process.env.PORT || 3000

app.use(
    cors({
        origin: '*'
    })
)

app.use(require('express-session')({ secret: 'secretpassphrase', resave: false, saveUninitialized: false }));
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.json());
app.use(flash())

app.get('/', (req, res) => {
    res.send('backend overhere!')
})

app.post('/create-account', async (req, res) => {
    try {
        const { userName, userEmail, userPassword } = req.body

        const newUser = new UserModel({
            userName,
            userEmail,
            userPassword
        })

        await newUser.save()

        res.json({ success: true, redirectRoute: 'http://localhost:5500/indexu.html' });
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, error: 'Erro interno do servidor' })
    }
})

app.post('/login', passport.authenticate('local'), (req, res) => {
    // Este trecho só será executado se a autenticação for bem-sucedida
    res.json({ success: true, redirectUrl: 'http://localhost:5500/indexu.html' });
});

passport.use(new LocalStrategy({
    usernameField: 'userEmail',
    passwordField: 'userPassword'
}, async (username, password, done) => {
    try {

        const user = await UserModel.findOne({ userEmail: username })

        if (!user) {
            console.log('user not found')
            return done(null, false, { message: 'User not found' })
        }

        const isMatch = await user.comparePassword(password)

        //testebruto
        if (isMatch && user) {
            console.log('| TESTE BRUTO |')
            console.log('autenticado')
        } else {
            console.log('nao autenticado')
        }

        if (isMatch) {
            return done(null, user)
        } else {
            return done(null, false, { message: 'Incorrect password' })
        }
    } catch (error) {
        console.error('Error', error);
        return done(error)
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id)
        done(null, user)
    } catch (error) {
        done(error)
    }
})

mongoose.connect(config.databaseConnectionString)

app.listen(PORT, () => {
    console.log(`server running at ${PORT}`)
})