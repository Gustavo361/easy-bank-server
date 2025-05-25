const passport = require('passport')
const UserModel = require('./db/userModel')

async function loginUser(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err)
        }
        if (!user) {
            console.log('user not logged')
            return res.status(401).json({ error: 'Usuário não encontrado.' })
        }

        req.logIn(user, function (err) {
            if (err) {
                return next(err)
            }
            console.log('user logged')
            res.json({ ok: true, message: 'Login bem-sucedido!', redirectRoute: 'https://easy-bank-ui.onrender.com/initial' })
        })
    })(req, res, next)
}

module.exports = loginUser