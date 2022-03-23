const fs = require('fs');
const pdfme = require('@pdfme/generator');
const path = require('path');
const BLANK_PDF = pdfme.BLANK_PDF;
const generate = pdfme.generate;
const stream = require('stream');

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

const qrBase = {
    "qrcode": {
        "type": "qrcode",
        "position": {
            "x": 5.45,
            "y": 3.07
        },
        "width": 20,
        "height": 20,
        "fontSize": 30,
    }
};

const textTypeBase = {
    "type": {
        "type": "text",
        "position": {
            "x": 32,
            "y": 12
        },
        "width": 60,
        "height": 7,
        "alignment": "left",
        "fontSize": 12,
        "characterSpacing": 0,
        "lineHeight": 1
    }
};

const logoBase = {
    "logo": {
        "type": "image",
        "position": {
            "x": 55,
            "y": 12
        },
        "width": 15,
        "height": 15,
        "alignment": "left",
        "fontSize": 13,
        "characterSpacing": 0,
        "lineHeight": 1
    }
};

const controllerLabelsDataDir = path.join(__dirname, 'controllerLabelsData');
const logoFile = path.join(controllerLabelsDataDir, 'logo_iestacio.png');
const logoImgData = "data:image/png;base64," + fs.readFileSync(logoFile, 'base64');

exports.generateLabels = function (req, res) {
    const schemas = [];
    const schemasInside = {};
    const inputs = [];
    const inputsInside = {};
    const colHorizontalIncrement = 65;
    const colVerticalIncrement = 30;

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 3; j++) {

            // QR
            let newQRKey = "qrcode" + i + "-" + j;
            let newElement = {}
            let position = {
                "x": 12 + j * colHorizontalIncrement,
                "y": 12 + i * colVerticalIncrement
            }
            newElement[newQRKey] = new schemaObj(qrBase.qrcode.type, position, qrBase.qrcode.width, qrBase.qrcode.height, qrBase.qrcode.fontSize);
            schemasInside[newQRKey] = newElement[newQRKey];
            inputsInside[newQRKey] = "https://http.cat/500";

            // Text type
            let newTypeKey = "type" + i + "-" + j;
            position = {
                "x": 36 + j * colHorizontalIncrement,
                "y": 12 + i * colVerticalIncrement
            }
            newElement[newTypeKey] = new schemaObj(textTypeBase.type.type, position, textTypeBase.type.width, textTypeBase.type.height, textTypeBase.type.fontSize);
            schemasInside[newTypeKey] = newElement[newTypeKey];
            inputsInside[newTypeKey] = "Monitor";

            // Text NS
            let newNSKey = "ns" + i + "-" + j;
            position = {
                "x": 36 + j * colHorizontalIncrement,
                "y": 24 + i * colVerticalIncrement
            }
            newElement[newNSKey] = new schemaObj(textTypeBase.type.type, position, textTypeBase.type.width, textTypeBase.type.height, textTypeBase.type.fontSize);
            schemasInside[newNSKey] = newElement[newNSKey];
            inputsInside[newNSKey] = "NS: 12345678910";

            // Logo image
            let newLogoKey = "logo" + i + "-" + j;
            position = {
                "x": 55 + j * colHorizontalIncrement,
                "y": 8.5 + i * colVerticalIncrement
            }
            newElement[newLogoKey] = new schemaObj(logoBase.logo.type, position, logoBase.logo.width, logoBase.logo.height, logoBase.logo.fontSize);
            schemasInside[newLogoKey] = newElement[newLogoKey];
            inputsInside[newLogoKey] = logoImgData;

        }
    }
    schemas.push(schemasInside);
    inputs.push(inputsInside);

    const template = {
        basePdf: BLANK_PDF,
        schemas: schemas,
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