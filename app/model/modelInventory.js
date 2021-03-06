'user strict';
var sql = require('./db.js');

// Inventory object constructor
var Inventory = function(inventory) {
    this.num_serie = inventory.num_serie;
    this.descripcio = inventory.descripcio;
    this.text_etiqueta = inventory.text_etiqueta;
    this.observacions = inventory.observacions;
    this.created_at = new Date();
    this.type_id = inventory.type_id;
    this.location_id = inventory.location_id;
};

Inventory.createInventory = function(newInventory, result) {
    sql.query('INSERT INTO inventory set ?', newInventory, function(err, res) {
        if (err) {
            console.error('error: ', err);
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

Inventory.getInventoriesByIds = function(inventoriesIds, result) {
    sql.query(`Select i.*, loc.aula as aula, t.descripcio as tipus, sai_id, cod_article, fabricant, model
    FROM inventory AS i
    INNER JOIN location as loc ON i.location_id=loc.location_id 
    INNER JOIN types as t ON i.type_id=t.type_id
    LEFT JOIN inventory_sai as sai ON i.num_serie=sai.num_serie
    where inventory_id IN (?) 
    ORDER BY location_id`, [inventoriesIds], function(err, res) {
        if (err) {
            console.error('error: ', err);
            result(err, null);
        } else {
            //console.log("RES", res)
            result(null, res);
        }
    });
};

Inventory.getInventoryIdByLocationType = function(whereFields, result) {
    let where = '';
    if (whereFields.location_id >= 0) {
        where += `location_id = ${whereFields.location_id}`;
    }

    if (whereFields.type_id >= 0) {
        if (where.length > 0) {
            where += ' AND '
        }
        where += `type_id = ${whereFields.type_id}`;
    }

    if (whereFields.from_date.length > 0) {
        if (where.length > 0) {
            where += ' AND '
        }
        where += `created_at >= ${whereFields.from_date}`;
    }

    if (whereFields.to_date.length > 0) {
        if (where.length > 0) {
            where += ' AND '
        }
        where += `created_at <= ${whereFields.to_date}`;
    }


    if (where.length == 0) {
        where = '1=1';
    }


    sql.query(`Select inventory_id from inventory where ${where} ORDER BY text_etiqueta`, function(err, res) {
        if (err) {
            console.error('error: ', err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

Inventory.getAllInventory = function(result) {
    sql.query(`Select i.inventory_id, i.num_serie, i.descripcio, i.text_etiqueta, i.observacions, i.created_at, loc.location_id, loc.aula, t.type_id, t.descripcio as tipus from inventory as i
     INNER JOIN location as loc ON i.location_id=loc.location_id
     INNER JOIN types as t ON i.type_id=t.type_id
     ORDER BY loc.aula, i.text_etiqueta`, function(err, res) {
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