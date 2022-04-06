'use strict';
require('dotenv').config();

exports.getUserData = function(req, res) {
    res.send(req.session.userData);
};

exports.login = function(req, res, next) {
    return res.redirect(301, "/login.html");
}

exports.logout = function(req, res, next) {
    if (req.session) {
        req.session.destroy();
    }
    return res.redirect(301, "/login");
}

exports.loginAction = function(req, res, next) {
    if (req.body && req.body.username && req.body.username === process.env.INVENTORY_USER &&
        req.body.password && req.body.password === process.env.INVENTORY_PASSWD) {
        req.session.userData = {};
        req.session.userData.email = req.body.username;
        req.session.userData.avatar = "img/computer-icon.png"
    }

    return res.redirect(301, req.session.redirectUrl);
}