const UserModel = require('./db/userModel')
const { isValidName, isValidEmail, isValidPassword } = require('./db/validation')

async function createAccount(req, res) {
    let { userName, userEmail, userPassword } = req.body

    const nameErrors = isValidName(userName)
    const emailErrors = isValidEmail(userEmail)
    const passwordErrors = isValidPassword(userPassword)

    if (Object.keys(nameErrors).length > 0 || Object.keys(emailErrors).length > 0 || Object.keys(passwordErrors).length > 0) {
        const validationErrors = {
            userName: nameErrors.userName,
            userEmail: emailErrors.userEmail,
            userPassword: passwordErrors.userPassword
        }

        res.status(400).json({ error: 'Preencha o formulário corretamente', validationErrors })
        return
    }

    const newUser = new UserModel({
        userName,
        userEmail,
        userPassword
    })

    try {
        await newUser.save()
        console.log('User creation status: User created successfully.')
        res.json({
            ok: true, message: 'Usuário cadastrado com sucesso!', userName: userName,
            redirectRoute: 'https://easy-bank-ui.onrender.com/initial.html'
        })
    } catch (error) {
        console.log('User creation status: User created unsuccessfully.', error)
        res.status(500).json({ error: 'Internal server error.' })
    }
}

module.exports = createAccount