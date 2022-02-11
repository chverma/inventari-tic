'use strict';

var Inventory = require('../model/modelInventory.js');
var Type = require('../model/modelType.js');
var Location = require('../model/modelLocation.js');
exports.list_all_inventory = function(req, res, next) {
    Inventory.getAllInventory(function(err, inventory) {
        if (err) {
            res.send(err);
        }
        res.send(inventory);
    });
};

exports.create_an_inventory = function(req, res) {
    var newInventory = new Inventory(req.body);

    // handles null error
    if (!newInventory) {
        res.status(400).send({ error: true, message: 'Please provide inventory' });
    } else {
        Inventory.createInventory(newInventory, function(err, inventory) {
            if (err) {
                res.status(400).json({ error: true, message: err });
            } else {
                res.json(inventory);
            }
        });
    }
};

exports.read_an_inventory = function(req, res) {
    Inventory.getInventoryById(req.params.inventoryId, function(err, inventory) {
        if (err) {
            res.send(err);
        }
        res.json(inventory);
    });
};

exports.update_an_inventory = function(req, res) {
    Inventory.updateById(req.params.inventoryId, new Inventory(req.body), function(err, inventory) {
        if (err) {
            res.send(err);
        }
        res.json(inventory);
    });
};

exports.delete_an_inventory = function(req, res) {
    Inventory.removeById(req.params.inventoryId, function(err, inventory) {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Inventory successfully deleted' });
    });
};

exports.generate_pdf = function(req, res) {
    var PizZip = require('pizzip');
    var Docxtemplater = require('docxtemplater');

    var fs = require('fs');
    var path = require('path');

    // Load the docx file as a binary
    var content = fs.readFileSync(path.resolve(__dirname, 'input.docx'), 'binary');

    var zip = new PizZip(content);
    var doc = new Docxtemplater();
    doc.loadZip(zip);

    Inventory.getInventoryById(req.params.inventoryId, function(err, inventory) {
        if (err) {
            res.send(err);
        } else {
            inventory = inventory[0];
            Type.getTypeById(inventory.motiu, function(err, type) {
                if (err) {
                    res.send(err);
                } else {
                    inventory.motiu = type[0].descripcio;
                    Location.getLocationById(inventory.location_id, function(err, location) {
                        if (err) {
                            res.send(err);
                        } else {
                            inventory.location = location[0].descripcio;
                            var dateIncidencia = new Date(inventory.data);
                            var strDateIncidencia = `${dateIncidencia.getDate()}/${dateIncidencia.getMonth() + 1}/${dateIncidencia.getFullYear()}`;
                            var strTimeIncidencia = `${dateIncidencia.getHours()}:${dateIncidencia.getMinutes()}`;

                            var dataComunication = new Date(inventory.dia_com_pares);
                            var strDateCom = `${dataComunication.getDate()}/${dataComunication.getMonth() + 1}/${dataComunication.getFullYear()}`;

                            doc.setData({
                                dia_com: strDateCom,
                                prof_nom: inventory.prof_nom,
                                prof_cog1: inventory.prof_cog1,
                                prof_cog2: inventory.prof_cog2,
                                al_nom: inventory.al_nom,
                                al_cog1: inventory.al_cog1,
                                al_cog2: inventory.al_cog2,
                                assignatura: inventory.assignatura,
                                grup: inventory.grup,
                                data_incidencia: strDateIncidencia,
                                hora_incidencia: strTimeIncidencia,
                                motiu: inventory.motiu ? inventory.motiu : '',
                                proposta: inventory.location ? inventory.location : '',
                                observacions: inventory.observacions ? inventory.observacions : ''
                            });

                            try {
                                // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                                doc.render();
                            } catch (error) {
                                var e = {
                                    message: error.message,
                                    name: error.name,
                                    stack: error.stack,
                                    properties: error.properties
                                };
                                console.log(JSON.stringify({ error: e }));
                                // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                                throw error;
                            }

                            var bufferDocx = doc.getZip().generate({ type: 'nodebuffer' });

                            const docx = require("@nativedocuments/docx-wasm");

                            // init docx engine
                            docx.init({
                                ND_DEV_ID: "28P401I90R065AOI9QUQAFRNEV", // goto https://developers.nativedocuments.com/ to get a dev-id/dev-secret
                                ND_DEV_SECRET: "3NHVA7MA6HLD6BP1AB63SF0F4G", // you can also set the credentials in the enviroment variables
                                ENVIRONMENT: "NODE", // required
                                LAZY_INIT: true // if set to false the WASM engine will be initialized right now, usefull pre-caching (like e.g. for AWS lambda)
                            }).catch(function(e) {
                                console.error(e);
                            });

                            async function convertHelper(document, exportFct) {
                                const api = await docx.engine();
                                await api.load(document);
                                const arrayBuffer = await api[exportFct]();
                                await api.close();
                                return arrayBuffer;
                            }

                            convertHelper(bufferDocx, "exportPDF")
                                .then((arrayBuffer) => {
                                    var generatedPDF = path.resolve(__dirname, 'sample.pdf');
                                    fs.writeFileSync(generatedPDF, new Uint8Array(arrayBuffer));
                                    return generatedPDF;
                                })
                                .then((generatedPDF) => {
                                    res.download(generatedPDF, 'part_incidencia.pdf');
                                })
                                .catch((e) => {
                                    console.error(e);
                                });
                        }
                    });
                }
            });
        }
    });
};