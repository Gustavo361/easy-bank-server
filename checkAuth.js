

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        const requestedRoute = req.path

        if (requestedRoute === '/login' || requestedRoute === '/create-account') {
            res.redirect('/initial')
        } else {
            next();
        }
    } else {
        const requestedRoute = req.path

        if (requestedRoute === '/initial') {
            res.redirect('/login')
        } else {
            next()
        }
    }
}

module.exports = checkAuthentication