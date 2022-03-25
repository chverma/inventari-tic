'use strict';

module.exports = function(app) {
    var inventoryList = require('../controllers/controllerInventorySai');

    app.post('/inventory_sai/parse_inventory', inventoryList.parse_inventory_sai_csv)
    app.get('/inventory_sai/:inventoryId', inventoryList.read_an_inventory);
    app.get('/inventory_sai/ns/:inventoryId', inventoryList.read_an_inventory_by_num_serie);
    app.get('/inventory_sai/', inventoryList.list_all_inventory);
};