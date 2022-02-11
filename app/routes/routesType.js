'use strict';

module.exports = function (app) {
  var controllerProposals = require('../controllers/controllerProposals');

  // todoList Routes
  app.get('/proposals', controllerProposals.list_all_proposals);
};
