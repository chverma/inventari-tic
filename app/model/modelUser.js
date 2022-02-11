'user strict';
var sql = require('./db.js');

// Incidence object constructor
var User = function(user) {
    this.email = user.email;
    this.password = user.password;
};

User.getUserData = function(result) {
    sql.query('Select * from administrator', function(err, res) {
        if (err) {
            console.error('error: ', err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};
module.exports = User;