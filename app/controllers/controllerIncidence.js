'use strict';

var Incidence = require('../model/modelIncidence.js');
var Fault = require('../model/modelFault.js');
var Proposal = require('../model/modelProposal.js');
exports.list_all_incidences = function (req, res, next) {
  Incidence.getAllIncidence(req.session.userData.email, function (err, incidence) {
    if (err) {
      res.send(err);
    }
    res.send(incidence);
  });
};

exports.create_an_incidence = function (req, res) {
  req.body.email = req.session.userData.email;
  var newIncidence = new Incidence(req.body);

  // handles null error
  if (!newIncidence) {
    res.status(400).send({error: true, message: 'Please provide incidence'});
  } else {
    Incidence.createIncidence(newIncidence, function (err, incidence) {
      if (err) {
        res.status(400).json({error: true, message: err});
      } else {
        res.json(incidence);
      }
    });
  }
};

exports.read_an_incidence = function (req, res) {
  Incidence.getIncidenceById(req.params.incidenceId, function (err, incidence) {
    if (err) {
      res.send(err);
    }
    res.json(incidence);
  });
};

exports.update_an_incidence = function (req, res) {
  Incidence.updateById(req.params.incidenceId, new Incidence(req.body), function (err, incidence) {
    if (err) {
      res.send(err);
    }
    res.json(incidence);
  });
};

exports.delete_an_incidence = function (req, res) {
  Incidence.removeById(req.params.incidenceId, function (err, incidence) {
    if (err) {
      res.send(err);
    }
    res.json({ message: 'Incidence successfully deleted' });
  });
};

exports.generate_pdf = function (req, res) {
  var PizZip = require('pizzip');
  var Docxtemplater = require('docxtemplater');

  var fs = require('fs');
  var path = require('path');

  // Load the docx file as a binary
  var content = fs.readFileSync(path.resolve(__dirname, 'input.docx'), 'binary');

  var zip = new PizZip(content);
  var doc = new Docxtemplater();
  doc.loadZip(zip);

  Incidence.getIncidenceById(req.params.incidenceId, function (err, incidence) {
    if (err) {
      res.send(err);
    } else {
      incidence = incidence[0];
      Fault.getFaultById(incidence.motiu, function (err, fault) {
        if (err) {
          res.send(err);
        } else {
          incidence.motiu = fault[0].descripcio;
          Proposal.getProposalById(incidence.proposal_id, function (err, proposal) {
            if (err) {
              res.send(err);
            } else {
              incidence.proposal = proposal[0].descripcio;
              var dateIncidencia = new Date(incidence.data);
              var strDateIncidencia = `${dateIncidencia.getDate()}/${dateIncidencia.getMonth() + 1}/${dateIncidencia.getFullYear()}`;
              var strTimeIncidencia = `${dateIncidencia.getHours()}:${dateIncidencia.getMinutes()}`;

              var dataComunication = new Date(incidence.dia_com_pares);
              var strDateCom = `${dataComunication.getDate()}/${dataComunication.getMonth() + 1}/${dataComunication.getFullYear()}`;

              doc.setData({
                dia_com: strDateCom,
                prof_nom: incidence.prof_nom,
                prof_cog1: incidence.prof_cog1,
                prof_cog2: incidence.prof_cog2,
                al_nom: incidence.al_nom,
                al_cog1: incidence.al_cog1,
                al_cog2: incidence.al_cog2,
                assignatura: incidence.assignatura,
                grup: incidence.grup,
                data_incidencia: strDateIncidencia,
                hora_incidencia: strTimeIncidencia,
                motiu: incidence.motiu ? incidence.motiu : '',
                proposta: incidence.proposal ? incidence.proposal : '',
                observacions: incidence.observacions ? incidence.observacions : ''
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
                console.log(JSON.stringify({error: e}));
                // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                throw error;
              }

              var bufferDocx = doc.getZip().generate({type: 'nodebuffer'});

              const docx = require("@nativedocuments/docx-wasm");

              // init docx engine
              docx.init({
                  ND_DEV_ID: "28P401I90R065AOI9QUQAFRNEV",    // goto https://developers.nativedocuments.com/ to get a dev-id/dev-secret
                  ND_DEV_SECRET: "3NHVA7MA6HLD6BP1AB63SF0F4G", // you can also set the credentials in the enviroment variables
                  ENVIRONMENT: "NODE", // required
                  LAZY_INIT: true      // if set to false the WASM engine will be initialized right now, usefull pre-caching (like e.g. for AWS lambda)
              }).catch( function(e) {
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
