var Inventory = require('../model/modelInventory.js');
const stream = require('stream');

exports.generate_pdf = function(items, req, res) {

    var PizZip = require('pizzip');
    var Docxtemplater = require('docxtemplater');

    var fs = require('fs');
    var path = require('path');

    // Load the docx file as a binary
    var content = fs.readFileSync(path.resolve(__dirname, 'input.docx'), 'binary');

    var zip = new PizZip(content);
    var doc = new Docxtemplater();
    doc.loadZip(zip);

    doc.setData({
        inventory: items,
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
            var readStream = new stream.PassThrough();
            readStream.end(new Uint8Array(arrayBuffer));
            res.set('Content-disposition', 'attachment; filename=etiquetes.pdf');
            res.set('Content-Type', 'application/pdf');

            readStream.pipe(res);

        })
        .catch((e) => {
            console.error(e);
        });

};