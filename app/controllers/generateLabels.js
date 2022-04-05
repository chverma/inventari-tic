const fs = require('fs');
const path = require('path');
const stream = require('stream');
const pdfme = require('@pdfme/generator');
const BLANK_PDF = pdfme.BLANK_PDF;
const generate = pdfme.generate;
require('dotenv').config();

function schemaObj(type, position, width, height, fontSize) {
    this.type = type;
    this.position = new positionObj(position.x, position.y);
    this.width = width;
    this.height = height;
    this.fontSize = fontSize;
}

function positionObj(x, y) {
    this.x = x;
    this.y = y;
}

const controllerLabelsDataDir = path.join(__dirname, 'controllerLabelsData');
const logoFile = path.join(controllerLabelsDataDir, 'logo_iestacio.png');
const baseEtiquetesFile = path.join(controllerLabelsDataDir, 'baseEtiquetes.pdf');
const logoImgData = "data:image/png;base64," + fs.readFileSync(logoFile, 'base64');
const baseEtiquetesData = "data:application/pdf;base64," + fs.readFileSync(baseEtiquetesFile, 'base64');

exports.generateLabels = function(inventory_items, req, res) {
    const colHorizontalIncrement = 104;
    const colVerticalIncrement = 37;
    const itemLength = inventory_items.length;
    const itemsPerPage = 16;
    let itemCount = 0;
    let pagesLength = Math.ceil(itemLength / itemsPerPage);
    let inputs = [];
    let schemasObj = {};
    for (let page = 0; page < pagesLength; page++) {
        let inputsObj = {};
        let row = 0;
        let col = 0;
        while (itemCount < itemLength && row < 8) {
            col = 0;
            while (itemCount < itemLength && col < 2) {
                let newObjKey = '';
                // QR
                newObjKey = "qrcode" + row + "-" + col;
                let position = {
                    "x": 12 + col * colHorizontalIncrement,
                    "y": 8 + row * colVerticalIncrement
                };
                schemasObj[newObjKey] = new schemaObj('qrcode', position, 20, 20, 0);
                inputsObj[newObjKey] = process.env.INVENTORY_HOST + '/detallInventari.html?inventory_id=' + inventory_items[itemCount].inventory_id;

                // Text type
                newObjKey = "type" + row + "-" + col;
                position = {
                    "x": 36 + col * colHorizontalIncrement,
                    "y": 8 + row * colVerticalIncrement
                };
                schemasObj[newObjKey] = new schemaObj('text', position, 60, 7, 12);
                inputsObj[newObjKey] = inventory_items[itemCount].text_etiqueta;

                // Text location
                newObjKey = "location" + row + "-" + col;
                position = {
                    "x": 36 + col * colHorizontalIncrement,
                    "y": 16 + row * colVerticalIncrement
                };
                schemasObj[newObjKey] = new schemaObj('text', position, 60, 7, 12);
                inputsObj[newObjKey] = inventory_items[itemCount].aula;

                // Text NS
                newObjKey = "ns" + row + "-" + col;
                position = {
                    "x": 36 + col * colHorizontalIncrement,
                    "y": 23 + row * colVerticalIncrement
                };
                schemasObj[newObjKey] = new schemaObj('text', position, 60, 7, 12);
                inputsObj[newObjKey] = inventory_items[itemCount].num_serie;

                // Logo image
                newObjKey = "logo" + row + "-" + col;
                position = {
                    "x": 82 + col * colHorizontalIncrement,
                    "y": 6 + row * colVerticalIncrement
                };
                schemasObj[newObjKey] = new schemaObj('image', position, 15, 15, 0);
                inputsObj[newObjKey] = logoImgData;

                col++;
                itemCount++;
            }
            row++;
        }
        inputs.push(inputsObj);
    }

    let template = {
        basePdf: baseEtiquetesData,
        schemas: [schemasObj],
    };

    //console.log(JSON.stringify(template), JSON.stringify(inputs))
    generate({ template, inputs }).then((pdf) => {
        var readStream = new stream.PassThrough();
        readStream.end(pdf);
        res.set('Content-disposition', 'attachment; filename=etiquetes.pdf');
        res.set('Content-Type', 'application/pdf');

        readStream.pipe(res);
        return pdf;
    });

}