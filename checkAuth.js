

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        const requestedRoute = req.path

        if (requestedRoute === '/login' || requestedRoute === '/create-account') {
            res.redirect('https://easy-bank-ui.onrender.com/initial')
        } else {
            next();
        }
    } else {
        const requestedRoute = req.path

        if (requestedRoute === '/initial') {
            res.redirect('https://easy-bank-ui.onrender.com/login')
        } else {
            next()
        }
    }
}

module.exports = checkAuthentication