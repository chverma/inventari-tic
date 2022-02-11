'user strict';
var sql = require('./db.js');

// Location object constructor
var Location = function (location) {
  this.aula = location.aula;
  this.observacions = location.observacions;
};

Location.createLocation = function (newLocation, result) {
  sql.query('INSERT INTO location set ?', newLocation, function (err, res) {
    if (err) {
      console.error('error: ', err);
      result(err, null);
    } else {
      newLocation.location_id = res.insertId;
      result(null, newLocation);
    }
  });
};

Location.getLocationById = function (locationId, result) {
  sql.query('Select * from location where location_id = ? ', locationId, function (err, res) {
    if (err) {
      console.error('error: ', err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

Location.getAllLocation = function (result) {
  sql.query('Select * from location', function (err, res) {
    if (err) {
      console.error('error: ', err);
      result(null, err);
    } else {
      result(null, res);
    }
  });
};

Location.updateById = function (id, location, result) {
  sql.query('UPDATE location SET ? WHERE location_id = ?', [location, id], function (err, res) {
    if (err) {
      console.error('error: ', err);
      result(null, err);
    } else {
      result(null, location);
    }
  });
};

Location.removeById = function (id, result) {
  sql.query('DELETE FROM location WHERE location_id = ?', [id], function (err, res) {
    if (err) {
      console.error('error: ', err);
      result(null, err);
    } else {
      result(null, res);
    }
  });
};

module.exports = Location;
