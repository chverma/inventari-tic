const fs = require('fs');
const path = require('path');
const stream = require('stream');
const pdfme = require('@pdfme/generator');
const BLANK_PDF = pdfme.BLANK_PDF;
const generate = pdfme.generate;

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
const logoImgData = "data:image/png;base64," + fs.readFileSync(logoFile, 'base64');

exports.generateLabels = function(inventory_items, req, res) {
    const schemasObj = {};
    const inputs = [];
    const inputsObj = {};
    const colHorizontalIncrement = 65;
    const colVerticalIncrement = 30;
    const itemLength = inventory_items.length;
    let itemCount = 0;

    let row = 0;
    let col = 0;
    while (itemCount < itemLength && row < 9) {
        col = 0;
        while (itemCount < itemLength && col < 3) {
            let newObjKey = '';
            // QR
            newObjKey = "qrcode" + row + "-" + col;
            let position = {
                "x": 12 + col * colHorizontalIncrement,
                "y": 12 + row * colVerticalIncrement
            };
            schemasObj[newObjKey] = new schemaObj('qrcode', position, 20, 20, 0);
            inputsObj[newObjKey] = 'http://inventaritic.com/detallInventari.html?inventory_id=' + inventory_items[itemCount].inventory_id;

            // Text type
            newObjKey = "type" + row + "-" + col;
            position = {
                "x": 36 + col * colHorizontalIncrement,
                "y": 12 + row * colVerticalIncrement
            };
            schemasObj[newObjKey] = new schemaObj('text', position, 60, 7, 12);
            inputsObj[newObjKey] = inventory_items[itemCount].text_etiqueta;

            // Text location
            newObjKey = "location" + row + "-" + col;
            position = {
                "x": 36 + col * colHorizontalIncrement,
                "y": 21 + row * colVerticalIncrement
            };
            schemasObj[newObjKey] = new schemaObj('text', position, 60, 7, 12);
            inputsObj[newObjKey] = inventory_items[itemCount].aula;

            // Text NS
            newObjKey = "ns" + row + "-" + col;
            position = {
                "x": 36 + col * colHorizontalIncrement,
                "y": 27 + row * colVerticalIncrement
            };
            schemasObj[newObjKey] = new schemaObj('text', position, 60, 7, 12);
            inputsObj[newObjKey] = 'NS: '+ inventory_items[itemCount].num_serie;

            // Logo image
            newObjKey = "logo" + row + "-" + col;
            position = {
                "x": 55 + col * colHorizontalIncrement,
                "y": 8.5 + row * colVerticalIncrement
            };
            schemasObj[newObjKey] = new schemaObj('image', position, 15, 15, 0);
            inputsObj[newObjKey] = logoImgData;

            col++;
            itemCount++;
        }
        row++;
    }

    inputs.push(inputsObj);

    const template = {
        basePdf: BLANK_PDF,
        schemas: [schemasObj],
    };

    //console.log(JSON.stringify(template), JSON.stringify(inputs))

    generate({ template, inputs }).then((pdf) => {
        var readStream = new stream.PassThrough();
        readStream.end(pdf);

        res.set('Content-disposition', 'attachment; filename=etiquetes.pdf');
        res.set('Content-Type', 'application/pdf');

        readStream.pipe(res);
    });
}