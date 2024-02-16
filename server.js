const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const bodyParser = require('body-parser')
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('./db/userModel')
const flash = require('connect-flash')
const dbconfig = require('./config/db')
const bcrypt = require('bcrypt')
const cors = require('cors')
const { isValidName, isValidEmail, isValidPassword } = require('./db/validation')
// const validation = require('./db/validation')
const methodOverride = require('method-override')

const app = express()
const PORT = process.env.PORT || 3000

// app.use(cors({origin: process.env.CORS_ORIGIN}))
app.use(cors({origin: '*'}))

app.use(require('express-session')({ secret: 'secretpassphrase', resave: false, saveUninitialized: false }));
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.json());
app.use(flash())
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.redirect('https://easy-bank-ui.onrender.com')
})

app.get('/create-account', (req, res) => {
    res.redirect('http://127.0.0.1:5500/create-account.html')
})

app.post('/create-account', async (req, res) => {
    let { userName, userEmail, userPassword } = req.body

    const nameErrors = isValidName(userName);
    const emailErrors = isValidEmail(userEmail);
    const passwordErrors = isValidPassword(userPassword);

    if (Object.keys(nameErrors).length > 0 || Object.keys(emailErrors).length > 0 || Object.keys(passwordErrors).length > 0) {
        const validationErrors = {
            userName: nameErrors.userName,
            userEmail: emailErrors.userEmail,
            userPassword: passwordErrors.userPassword
        };

        res.status(400).json({ error: 'Preencha o formulário corretamente', validationErrors });
        return;
    }

    // Crie um novo usuário usando o modelo mongoose
    const newUser = new UserModel({
        userName,
        userEmail,
        userPassword  
    })

    try {
        await newUser.save();
        console.log('User creation status: User created successfully.')
        res.json({ ok: true, message: 'Usuário cadastrado com sucesso!', redirectRoute: 'http://localhost:5500/indexu.html' })
    } catch (error) {
        console.log('User creation status: User created unsuccessfully.', error)
        res.status(500).json({ error: 'Internal server error.' });
    }
})

mongoose.connect(dbconfig.databaseConnectionString)

app.get('/test', (req, res) => {
    res.send('backend here!')
})

app.listen(PORT, () => {
    console.log(`server's running at http://localhost:${PORT}`)
})