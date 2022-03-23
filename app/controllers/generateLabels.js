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

exports.generateLabels = function (req, res) {
    const schemasObj = {};
    const inputs = [];
    const inputsObj = {};
    const colHorizontalIncrement = 65;
    const colVerticalIncrement = 30;

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 3; j++) {
            let newObjKey = '';
            // QR
            newObjKey = "qrcode" + i + "-" + j;
            let position = {
                "x": 12 + j * colHorizontalIncrement,
                "y": 12 + i * colVerticalIncrement
            };
            schemasObj[newObjKey] = new schemaObj('qrcode', position, 20, 20, 0);
            inputsObj[newObjKey] = "https://http.cat/500";

            // Text type
            newObjKey = "type" + i + "-" + j;
            position = {
                "x": 36 + j * colHorizontalIncrement,
                "y": 12 + i * colVerticalIncrement
            };
            schemasObj[newObjKey] = new schemaObj('text', position, 60, 7, 12);
            inputsObj[newObjKey] = "Monitor";

            // Text NS
            newObjKey = "ns" + i + "-" + j;
            position = {
                "x": 36 + j * colHorizontalIncrement,
                "y": 24 + i * colVerticalIncrement
            };
            schemasObj[newObjKey] = new schemaObj('text', position, 60, 7, 12);
            inputsObj[newObjKey] = "NS: 12345678910";

            // Logo image
            newObjKey = "logo" + i + "-" + j;
            position = {
                "x": 55 + j * colHorizontalIncrement,
                "y": 8.5 + i * colVerticalIncrement
            };
            schemasObj[newObjKey] = new schemaObj('image', position, 15, 15, 0);
            inputsObj[newObjKey] = logoImgData;

        }
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