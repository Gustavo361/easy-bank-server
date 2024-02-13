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
const methodOverride = require('method-override')

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
// app.use(methodOverride('_method'))



app.get('/', checkAuthenticated, (req, res) => {
    // if (req.isAuthenticated()) {
        // res.send('backend overhere!')
    //     res.redirect('http://localhost:5500/indexu.html')
    // } else {
    //     res.redirect('http://localhost:5500/login.html')
    // }
})

app.post('/create-account', checkNotAuthenticated, async (req, res) => {
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

app.post('/login', checkNotAuthenticated,  passport.authenticate('local'), (req, res) => {
    res.json({ success: true, redirectUrl: 'http://localhost:5500/indexu.html' });
});

app.get('/login', checkNotAuthenticated, passport.authenticate('local'), (req, res) => {
    res.redirect('http://localhost:5500/login.html')
})

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        console.log('logged out')
        res.redirect('http://localhost:5500')
    })
})

app.get('/indexu', checkAuthenticated, (req, res) => {
    res.redirect('http://localhost:5500/indexu.html')
})

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
            console.log('Autenticação bem-sucedida');
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
    console.log('Serialize User:', user);
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    console.log('Deserialize User:', id);
    try {
        const user = await UserModel.findById(id)
        done(null, user)
    } catch (error) {
        done(error)
    }
})

mongoose.connect(config.databaseConnectionString)

function checkAuthenticated(req, res, next) {
    console.log('Middleware checkAuthenticated chamado');

    if (req.isAuthenticated()) {
        console.log('Estado de autenticação:', req.isAuthenticated())
        // res.redirect('http://localhost:5500/indexu.html')
        return next()
    } else {
        res.redirect('http://localhost:5500/login.html')
        console.log('Estado de autenticação:', req.isAuthenticated())
        // next()
    }
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('Estado de autenticação:', req.isAuthenticated())
        return res.redirect('http://localhost:5500/indexu.html')
    }

    return next()
}

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Erro interno do servidor');
});

app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`)
})