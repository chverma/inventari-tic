'use strict';

module.exports = function(app) {
    var controllerUser = require('../controllers/controllerUser');

    app.get('/user', controllerUser.getUserData);
    app.get("/login", controllerUser.login);

    app.get('/logout', controllerUser.logout);
    app.post('/login', controllerUser.loginAction);
};