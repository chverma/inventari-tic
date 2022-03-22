'use strict';

module.exports = function(app) {
    var controllerType = require('../controllers/controllerType');
    app.get('/type', controllerType.list_all_types);
    app.post('/type', controllerType.create_type);
    app.get('/type/:typeId', controllerType.read_type);
    app.put('/type/:typeId', controllerType.update_type);
    app.delete('/type/:typeId', controllerType.delete_type);
};