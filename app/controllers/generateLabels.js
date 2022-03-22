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

const logoData = "data:image/png;base64,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";

exports.generateLabels = function (req, res) {
    const pdfme = require('@pdfme/generator');
    const fs = require('fs');
    const path = require('path');
    const BLANK_PDF = pdfme.BLANK_PDF;
    const generate = pdfme.generate;

    const schemas = [];
    const schemasInside = {};
    const inputs = [];
    const inputsInside = {};
    const colHorizontalIncrement = 65;
    const colVerticalIncrement = 30;

    for (var i = 0; i < 8; i++) {
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
            inputsInside[newLogoKey] = logoData;

        }
    }
    schemas.push(schemasInside);
    inputs.push(inputsInside);

    const template = {
        basePdf: BLANK_PDF,
        schemas: schemas,
    };

    console.log(JSON.stringify(template), JSON.stringify(inputs))

    generate({ template, inputs }).then((pdf) => {
        fs.writeFileSync(path.join(__dirname, `etiquetes.pdf`), pdf);
        var generatedPDF = path.resolve(__dirname, 'etiquetes.pdf');
        return generatedPDF;
    })
        .then((generatedPDF) => {
            res.download(generatedPDF, 'etiquetes.pdf');
        });
}