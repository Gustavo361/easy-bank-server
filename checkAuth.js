function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        // Se autenticado e tentando acessar login/cadastro, redireciona
        if (req.path === '/login' || req.path === '/create-account') {
            return res.redirect('https://easy-bank-ui.onrender.com/initial');
        }
        return next();
    } else {
        // Se NÃO autenticado e tentando acessar rotas protegidas
        if (req.path === '/' || req.path === '/initial' || req.path === '/create-account') {
            return res.redirect('https://easy-bank-ui.onrender.com/login');
        }
        return next();
    }
}

module.exports = checkAuthentication

