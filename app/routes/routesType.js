'use strict';

module.exports = function(app) {
    var controllerType = require('../controllers/controllerType');
    app.get('/type', controllerType.list_all_types);
};