'use strict';
var InventorySai = require('../model/modelInventorySai.js');
const Uuid  = require('uuid');

exports.read_an_inventory = function (req, res) {
    InventorySai.getInventoryById(req.params.inventoryId, function (err, inventory) {
        if (err) {
            res.send(err);
        }
        res.json(inventory);
    });
};

exports.read_an_inventory_by_num_serie = function (req, res) {
    InventorySai.getInventoryByIdNumSerie(req.params.inventoryNumSerie, function (err, inventory) {
        if (err) {
            res.send(err);
        }
        res.json(inventory);
    });
};

exports.list_all_inventory = function(req, res, next) {
    InventorySai.getAllInventory(function(err, inventory) {
        if (err) {
            res.send(err);
        }
        res.send(inventory);
    });
};

exports.parse_inventory_sai_csv = function (req, res) {
    const XLSX = require("xlsx");
    const formidable = require("formidable");

    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
        var f = files[Object.keys(files)[0]];

        const filepath = f.filepath;
        const workbook = XLSX.readFile(filepath, { type: 'string' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        var jsa = XLSX.utils.sheet_to_json(worksheet, { raw: true, header: 1 });

        /* [
            'Nom',
            'Entitat',
            'Estat',
            'Tipus' => sols en pantalles
            'GVA - Codi Article',
            'GVA - Descripció Codi Article',
            'Número de sèrie',
            'Fabricant',
            'Model',
            'GVA - Espai Destí',
            'GVA - Descripció Espai Destí'
            ]
        */
        let sai_id;
        let estat;
        let cod_article;
        let desc_cod_article;
        let num_serie;
        let fabricant;
        let model;
        let espai_desti;
        let desc_espai_desti;

        let inventorySAI = {};

        let isai_id = 0;
        let iestat = 1;
        let icod_article = 1;
        let idesc_cod_article = 1;
        let inum_serie = 1;
        let ifabricant = 1;
        let imodel = 1;
        let iespai_desti = 1;
        let idesc_espai_desti = 1;
        // is PC
        let isPC = false;
        if (jsa[0].length == 10) {
            
        }
        for (var i = 1; i < jsa.length; i++) {
            sai_id = jsa[i][0].split('(')[1].replace(')', '');
            estat = jsa[i][2];
            cod_article = jsa[i][3];
            if (jsa[i][4]) {
                desc_cod_article = Buffer.from(jsa[i][4], 'utf-8').toString();
            } else {
                desc_cod_article = undefined;
            }
            num_serie = jsa[i][5];

            if (num_serie == 'To be filled by O.E.M.' || num_serie == '"To be filled by O.E.M."') {
                num_serie = 'To be filled by O.E.M.' + Uuid.v4();
            }
            if (!num_serie) {
                num_serie = "sense_num"
            }
            fabricant = jsa[i][6];
            model = jsa[i][7];
            espai_desti = jsa[i][8];
            desc_espai_desti = jsa[i][9];

            inventorySAI = {
                sai_id: sai_id,
                estat: estat,
                cod_article: cod_article,
                desc_cod_article: desc_cod_article,
                num_serie: num_serie,
                fabricant: fabricant,
                model: model,
                num_serie: num_serie,
                espai_desti: espai_desti,
                desc_espai_desti: desc_espai_desti
            };

            // Remove INDEFINIDO
            Object.keys(inventorySAI).forEach(function(key) {
                var val = inventorySAI[key];
                if (val == 'INDEFINIDO') {
                    inventorySAI[key] = undefined;
                }
              });
            InventorySai.createInventory(inventorySAI, function (err, inventory) {
                if (err) {
                    console.error('ERROR: ', err)
                }

            });
        }
        res.json({ message: 'Inventory SAI successfully inserted' });
    });
    
}