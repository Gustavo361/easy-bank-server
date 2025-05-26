// function checkAuthentication(req, res, next) {
//     if (req.isAuthenticated()) {
//         // Se autenticado e tentando acessar login/cadastro, redireciona
//         if (req.path === '/login' || req.path === '/create-account') {
//             return res.redirect('https://easy-bank-ui.onrender.com/initial');
//         }
//         return next();
//     } else {
//         // Se NÃO autenticado e tentando acessar rotas protegidas
//         if (req.path === '/' || req.path === '/initial' || req.path === '/create-account') {
//             return res.redirect('https://easy-bank-ui.onrender.com/login');
//         }
//         return next();
//     }
// }

// module.exports = checkAuthentication


function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        // Permite acesso a rotas protegidas
        return next();
    } else {
        // Redireciona para login se tentar acessar rota protegida
        return res.redirect('https://easy-bank-ui.onrender.com/login');
    }
}

module.exports = checkAuthentication