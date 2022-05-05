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

const labelModel = {};
labelModel['1272'] = {
    'colHorizontalIncrement': 70,
    'colVerticalIncrement': 35,
    'itemsPerPage': 24,
    'cols': 3,
    'rows': 8,
    'qrcode': {
        'x': 5,
        'y': 13
    },
    'text_etiqueta': {
        'x': 26,
        'y': 12
    },
    'aula': {
        'x': 26,
        'y': 22
    },
    'ns': {
        'x': 26,
        'y': 28
    },
    'logo': {
        'x': 50,
        'y': 10
    },
};
labelModel['11783'] = {
    'colHorizontalIncrement': 104,
    'colVerticalIncrement': 37,
    'itemsPerPage': 16,
    'cols': 2,
    'rows': 8,
    'qrcode': {
        'x': 12,
        'y': 8
    },
    'text_etiqueta': {
        'x': 36,
        'y': 8
    },
    'aula': {
        'x': 36,
        'y': 16
    },
    'ns': {
        'x': 36,
        'y': 23
    },
    'logo': {
        'x': 82,
        'y': 6
    },
};

const labelModelName = '11783';

const controllerLabelsDataDir = path.join(__dirname, 'controllerLabelsData');
const logoFile = path.join(controllerLabelsDataDir, 'logo_iestacio.png');
const baseEtiquetesFile = path.join(controllerLabelsDataDir, 'baseEtiquetes' + labelModelName + '.pdf');
const logoImgData = "data:image/png;base64," + fs.readFileSync(logoFile, 'base64');
const baseEtiquetesData = "data:application/pdf;base64," + fs.readFileSync(baseEtiquetesFile, 'base64');

exports.generateLabels = function(inventory_items, req, res) {
    const colHorizontalIncrement = labelModel[labelModelName].colHorizontalIncrement;
    const colVerticalIncrement = labelModel[labelModelName].colVerticalIncrement;
    const itemLength = inventory_items.length;
    const itemsPerPage = labelModel[labelModelName].itemsPerPage;
    let itemCount = 0;
    let pagesLength = Math.ceil(itemLength / itemsPerPage);
    let inputs = [];
    let schemasObj = {};
    for (let page = 0; page < pagesLength; page++) {
        let inputsObj = {};
        let row = 0;
        let col = 0;
        while (itemCount < itemLength && row < labelModel[labelModelName].rows) {
            col = 0;
            while (itemCount < itemLength && col < labelModel[labelModelName].cols) {
                let newObjKey = '';
                // QR
                newObjKey = "qrcode" + row + "-" + col;
                let position = {
                    "x": labelModel[labelModelName].qrcode.x + col * colHorizontalIncrement,
                    "y": labelModel[labelModelName].qrcode.y + row * colVerticalIncrement
                };
                schemasObj[newObjKey] = new schemaObj('qrcode', position, 20, 20, 0);
                inputsObj[newObjKey] = process.env.INVENTORY_HOST + '/detallInventari.html?inventory_id=' + inventory_items[itemCount].inventory_id;

                // Text type
                newObjKey = "type" + row + "-" + col;
                position = {
                    "x": labelModel[labelModelName].text_etiqueta.x + col * colHorizontalIncrement,
                    "y": labelModel[labelModelName].text_etiqueta.y + row * colVerticalIncrement
                };

                schemasObj[newObjKey] = new schemaObj('text', position, 60, 7, 20);
                inputsObj[newObjKey] = inventory_items[itemCount].text_etiqueta;


                // Text location
                newObjKey = "location" + row + "-" + col;
                position = {
                    "x": labelModel[labelModelName].aula.x + col * colHorizontalIncrement,
                    "y": labelModel[labelModelName].aula.y + row * colVerticalIncrement
                };
                schemasObj[newObjKey] = new schemaObj('text', position, 60, 7, 12);
                inputsObj[newObjKey] = inventory_items[itemCount].aula;

                // Text NS
                newObjKey = "ns" + row + "-" + col;
                position = {
                    "x": labelModel[labelModelName].ns.x + col * colHorizontalIncrement,
                    "y": labelModel[labelModelName].ns.y + row * colVerticalIncrement
                };
                let fontSize;
                if (inventory_items[itemCount].num_serie.length > 15 && labelModel[labelModelName].itemsPerPage > 16) {
                    fontSize = 9;
                } else {
                    fontSize = 12;
                }
                schemasObj[newObjKey] = new schemaObj('text', position, 60, 7, fontSize);
                inputsObj[newObjKey] = inventory_items[itemCount].num_serie;

                // Logo image
                newObjKey = "logo" + row + "-" + col;
                position = {
                    "x": labelModel[labelModelName].logo.x + col * colHorizontalIncrement,
                    "y": labelModel[labelModelName].logo.y + row * colVerticalIncrement
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
        return pdf;
    });

}