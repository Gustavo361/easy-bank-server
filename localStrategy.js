const LocalStrategy = require('passport-local').Strategy
const UserModel = require('./db/userModel')

const localStrategy = new LocalStrategy(
    {
        usernameField: 'userEmail',
        passwordField: 'userPassword',
    },
    async function (email, password, done) {
        try {
            const user = await UserModel.findOne({ userEmail: email })

            if (!user) {
                return done(null, false)
            }

            const isMatch = await user.comparePassword(password)

            if (isMatch) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        } catch (error) {
            return done(error)
        }
    }
)

module.exports = localStrategy
