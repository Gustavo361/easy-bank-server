const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { isValidName, isValidEmail, isValidPassword } = require('./validation')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        validate: {
            validator: isValidName,
            message: 'Nome inválido'
        }
    },
    userEmail: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: isValidEmail,
            message: 'E-mail inválido'
        }
    },
    userPassword: {
        type: String,
        required: true,
        unique: false,
        validate: {
            validator: isValidPassword,
            message: 'Senha: Mínimo de 8 caracteres, com pelo menos 1 letra e 1 número.'
        }
    }
})

userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('userPassword')) {
            return next()
        }
        let hashedPassword = await bcrypt.hash(this.userPassword, 12)

        this.userPassword = hashedPassword

        return next()
    } catch (error) {
        return next(error)
    }
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.userPassword);
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

const UserModel = mongoose.model('User', userSchema)
module.exports = UserModel