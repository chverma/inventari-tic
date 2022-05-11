'use strict';

module.exports = function(app) {
    var inventoryList = require('../controllers/controllerInventory');

    // todoList Routes
    app.get('/inventory/generate_labels/:inventory_items', inventoryList.generate_labels);
    app.get('/inventory/generate_labels_by_loc_type/', inventoryList.generate_labels_by_loc_type);
    app.get('/inventory/generate_report/', inventoryList.generate_pdf);
    app.get('/inventory/count/', inventoryList.get_num_items_on_location_by_type);
    app.get('/inventory', inventoryList.list_all_inventory);
    app.post('/inventory', inventoryList.create_an_inventory);

    app.get('/inventory/:inventoryId', inventoryList.read_an_inventory);
    app.put('/inventory/:inventoryId', inventoryList.update_an_inventory);
    app.delete('/inventory/:inventoryId', inventoryList.delete_an_inventory);



};