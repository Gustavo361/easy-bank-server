function isValidName(name) {
    const nameRegex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/
    const errors = {}

    if (!nameRegex.test(name)) {
        errors.userName = 'O nome deve conter apenas letras e espaços.'
    }

    return errors
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const errors = {}

    if (!emailRegex.test(email)) {
        errors.userEmail = 'Por favor, insira um e-mail válido.'
    }

    return errors
}

function isValidPassword(password) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
    const errors = {}

    if (!passwordRegex.test(password)) {
        errors.userPassword = 'Senha: Mínimo de 8 caracteres, com ao menos 1 letra e 1 número.'
    }

    return errors
}

module.exports = { isValidName, isValidEmail, isValidPassword }