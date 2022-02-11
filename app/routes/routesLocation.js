'use strict';

module.exports = function (app) {
  var controllerLocation = require('../controllers/controllerLocation');

  app.get('/location', controllerLocation.list_all_location);
  app.post('/location', controllerLocation.create_location);

  app.get('/location/:locationId', controllerLocation.read_location);
  app.put('/location/:locationId', controllerLocation.update_location);
  app.delete('/location/:locationId', controllerLocation.delete_location);
};
