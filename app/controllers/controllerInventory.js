'use strict';
var Inventory = require('../model/modelInventory.js');
var Type = require('../model/modelType.js');
var Location = require('../model/modelLocation.js');
var Labels = require('./generateLabels.js');
var Report = require('./controllerReport.js');

const list_all_inventory = function(req, res, next) {
    Inventory.getAllInventory(function(err, inventory) {
        if (err) {
            res.send(err);
        }
        res.send(inventory);
    });
};

const create_an_inventory = function(req, res) {
    var newInventory = new Inventory(req.body);

    // handles null error
    if (!newInventory) {
        res.status(400).send({ error: true, message: 'Please provide inventory' });
    } else {
        newInventory.num_serie = newInventory.num_serie.toUpperCase();
        Inventory.createInventory(newInventory, function(err, inventory) {
            if (err) {
                res.status(400).json({ error: true, message: err });
            } else {
                res.json(inventory);
            }
        });
    }
};

const read_an_inventory = function(req, res) {
    Inventory.getInventoryById(req.params.inventoryId, function(err, inventory) {
        if (err) {
            res.send(err);
        }
        res.json(inventory);
    });
};

const update_an_inventory = function(req, res) {
    Inventory.updateById(req.params.inventoryId, new Inventory(req.body), function(err, inventory) {
        if (err) {
            res.send(err);
        }
        res.json(inventory);
    });
};

const delete_an_inventory = function(req, res) {
    Inventory.removeById(req.params.inventoryId, function(err, inventory) {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Inventory successfully deleted' });
    });
};

const generate_pdf = function(req, res) {
    let search = JSON.parse(req.query.search);
    search['from_date'] = req.query.from_date;
    search['to_date'] = req.query.to_date;

    Inventory.getInventoryIdByLocationType(search, (err, inventoryIds) => {
        inventoryIds = inventoryIds.map((val, key) => {
            return val['inventory_id'];
        });
        req.params.inventory_items = JSON.stringify(inventoryIds);
        let inventory_id_items = JSON.parse(req.params.inventory_items);
        Inventory.getInventoriesByIds(inventory_id_items, (err, inventoryItems) => {
            Report.generate_pdf(inventoryItems, req, res);
        });
    });
};

const generate_labels = function(req, res) {
    let inventory_id_items = JSON.parse(req.params.inventory_items);
    Inventory.getInventoriesByIds(inventory_id_items, (err, inventoryItems) => {
        Labels.generateLabels(inventoryItems, req, res);
    });
}

const generate_labels_by_loc_type = function(req, res) {
    let search = JSON.parse(req.query.search);
    search['from_date'] = req.query.from_date;
    search['to_date'] = req.query.to_date;

    Inventory.getInventoryIdByLocationType(search, (err, inventoryIds) => {
        inventoryIds = inventoryIds.map((val, key) => {
            return val['inventory_id'];
        });
        req.params.inventory_items = JSON.stringify(inventoryIds);
        generate_labels(req, res);
    });
}

const get_num_items_on_location_by_type = function(req, res) {
    let search = JSON.parse(req.query.search);
    search['from_date'] = req.query.from_date;
    search['to_date'] = req.query.to_date;
    Inventory.getInventoryIdByLocationType(search, (err, inventoryIds) => {
        inventoryIds = inventoryIds.map((val, key) => {
            return val['inventory_id'];
        });
        res.json(inventoryIds);
    });
}

module.exports = { list_all_inventory, create_an_inventory, read_an_inventory, update_an_inventory, delete_an_inventory, generate_labels, generate_labels_by_loc_type, generate_pdf, get_num_items_on_location_by_type }