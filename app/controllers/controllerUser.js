'use strict';

exports.getUserData = function(req, res) {
    res.send(req.session.userData);
};
// Code to encrypt password
/*bcrypt.hash(password, 10, function(err, hash) {
  var sql = "INSERT INTO curd_table (first_name,last_name,username,password) VALUES ?";
  var values = [
      [firstname, lastname, username, hash]
  ]
  con.query(sql, [values], function(err, result, fields) {
      if (err) throw err;
      res.send({ message: 'Table Data', Total_record: result.length, result: result });
  });
});*/