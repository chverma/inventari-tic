'user strict';
var sql = require('./db.js');

// Inventory object constructor
var Inventory = function(inventory) {
    this.num_serie = inventory.num_serie;
    this.descripcio = inventory.descripcio;
    this.observacions = inventory.observacions;
    this.created_at = new Date();
    this.type_id = inventory.type_id;
    this.location_id = inventory.location_id;
};

Inventory.createInventory = function(newInventory, result) {
    sql.query('INSERT INTO inventory set ?', newInventory, function(err, res) {
        if (err) {
            //console.error('error: ', err);
            result(err, null);
        } else {
            newInventory.inventory_id = res.insertId;
            result(null, newInventory);
        }
    });
};

Inventory.getInventoryById = function(inventoryId, result) {
    sql.query('Select * from inventory where inventory_id = ? ', inventoryId, function(err, res) {
        if (err) {
            console.error('error: ', err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

Inventory.getAllInventory = function(email, result) {
    sql.query(`Select * from inventory`, function(err, res) {
        if (err) {
            console.error('error: ', err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};

Inventory.updateById = function(id, inventory, result) {
    sql.query('UPDATE inventory SET ? WHERE inventory_id = ?', [inventory, id], function(err, res) {
        if (err) {
            console.error('error: ', err);
            result(null, err);
        } else {
            result(null, inventory);
        }
    });
};

Inventory.removeById = function(id, result) {
    sql.query('DELETE FROM inventory WHERE inventory_id = ?', [id], function(err, res) {
        if (err) {
            console.error('error: ', err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};

module.exports = Inventory;