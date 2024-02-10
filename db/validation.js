function isValidName(name) {
    const nameRegex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
    return nameRegex.test(name);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    // A senha deve ter pelo menos 8 caracteres e incluir pelo menos uma letra e um número
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
}

module.exports = { isValidName, isValidEmail, isValidPassword };