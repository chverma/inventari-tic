exports.generateLabels = function(req, res) {
    const pdfme = require('@pdfme/generator');
    //import { Template, generate, BLANK_PDF } from 

    const fs = require('fs');
    const path = require('path');
    const BLANK_PDF = pdfme.BLANK_PDF;
    const generate = pdfme.generate;

    const qrBase = {
        "qrcode": {
            "type": "qrcode",
            "position": {
                "x": 5.45,
                "y": 3.07
            },
            "width": 20,
            "height": 20,
            "alignment": "left",
            "fontSize": 30,
            "characterSpacing": 0,
            "lineHeight": 1
        }
    };

    const schemas = [];
    const inputs = [];
    const position = {
        "x": 5.45,
        "y": 3.07
    };
    const colHorizontalIncrement = 40;
    const colVerticalIncrement = 40;
    for (var i = 0; i < 3; i++) {
        position.x = position.x + i * colHorizontalIncrement;
        for (var j = 0; j < 3; j++) {
            position.y = position.y + j * colVerticalIncrement;
            let newKey = "qrcode" + i + "-" + j;
            let newQr = {}
            newQr[newKey] = qrBase.qrcode

            newQr[newKey].position = position;
            schemas.push(newQr);
            let newInput = {};
            newInput[newKey] = "https://labelmake.jp/";
            inputs.push(newInput);

        }
    }
    console.log(schemas)
    console.log(inputs)
    const template = {
        basePdf: BLANK_PDF,
        schemas: schemas,
    };


    generate({ template, inputs }).then((pdf) => {
            //console.log(pdf);

            // Node.js
            fs.writeFileSync(path.join(__dirname, `test.pdf`), pdf);
            var generatedPDF = path.resolve(__dirname, 'test.pdf');
            //fs.writeFileSync(generatedPDF, new Uint8Array(arrayBuffer));
            return generatedPDF;
        })
        .then((generatedPDF) => {
            res.download(generatedPDF, 'part_incidencia.pdf');
        });
}