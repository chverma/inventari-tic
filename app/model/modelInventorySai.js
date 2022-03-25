'user strict';
var sql = require('./db.js');

// Inventory object constructor
var InventorySAI = function (inventory) {
    this.sai_id = inventory.sai_id;
    this.estat = inventory.estat;
    this.tipus = inventory.tipus;
    this.cod_article = inventory.cod_article;
    this.desc_cod_article = inventory.desc_cod_article;
    this.num_serie = inventory.num_serie;
    this.fabricant = inventory.fabricant;
    this.model = inventory.model;
    this.espai_desti = inventory.espai_desti;
    this.desc_espai_desti = inventory.desc_espai_desti;
};

InventorySAI.createInventory = function (newInventory, result) {
    sql.query('INSERT INTO inventory_sai set ?', newInventory, function (err, res) {
        if (err) {
            //console.error('error: ', err);
            result(err, null);
        } else {
            newInventory.inventory_id = res.insertId;
            result(null, newInventory);
        }
    });
};

InventorySAI.getInventoryById = function (inventoryId, result) {
    sql.query('Select * from inventory_sai where inventory_sai_id = ? ', inventoryId, function (err, res) {
        if (err) {
            console.error('error: ', err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

InventorySAI.getInventoryByNumSerie = function (inventoryNumSerie, result) {
    sql.query('Select * from inventory_sai where num_serie = ? ', inventoryNumSerie, function (err, res) {
        if (err) {
            console.error('error: ', err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

InventorySAI.getAllInventory = function(result) {
    sql.query('Select * from inventory_sai', function(err, res) {
        if (err) {
            console.error('error: ', err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};

module.exports = InventorySAI;