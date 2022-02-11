'use strict';

var Location = require('../model/modelLocation.js');

exports.list_all_location = function (req, res, next) {
  Location.getAllLocation(function (err, location) {
    if (err) {
      res.send(err);
    }
    res.send(location);
  });
};

exports.create_location = function (req, res) {
  var newLocation = new Location(req.body);

  // handles null error
  if (!newLocation) {
    res.status(400).send({error: true, message: 'Please provide location'});
  } else {
    Location.createLocation(newLocation, function (err, location) {
      if (err) {
        res.status(400).json({error: true, message: err});
      } else {
        res.json(location);
      }
    });
  }
};

exports.read_location = function (req, res) {
  Location.getLocationById(req.params.locationId, function (err, location) {
    if (err) {
      res.send(err);
    }
    res.json(location);
  });
};

exports.update_location = function (req, res) {
  Location.updateById(req.params.locationId, new Location(req.body), function (err, location) {
    if (err) {
      res.send(err);
    }
    res.json(location);
  });
};

exports.delete_location = function (req, res) {
  Location.removeById(req.params.locationId, function (err, location) {
    if (err) {
      res.send(err);
    }
    res.json({ message: 'Location successfully deleted' });
  });
};
