'use strict';

module.exports = function(app) {
    var inventoryList = require('../controllers/controllerInventory');

    // todoList Routes
    app.get('/inventory/generate_labels', inventoryList.generate_labels);
    app.get('/inventory', inventoryList.list_all_inventory);
    app.post('/inventory', inventoryList.create_an_inventory);

    app.get('/inventory/:inventoryId', inventoryList.read_an_inventory);
    app.put('/inventory/:inventoryId', inventoryList.update_an_inventory);
    app.delete('/inventory/:inventoryId', inventoryList.delete_an_inventory);
    app.get('/inventory/generate/:inventoryId', inventoryList.generate_pdf);


};