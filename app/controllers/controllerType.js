'use strict';

var Type = require('../model/modelType.js');

exports.list_all_types = function(req, res, next) {
    Type.getAllType(function(err, type) {
        if (err) {
            res.send(err);
        }
        res.send(type);
    });
};

exports.create_type = function(req, res) {
    var newType = new Type(req.body);

    // handles null error
    if (!newType) {
        res.status(400).send({ error: true, message: 'Please provide type' });
    } else {
        Type.createType(newType, function(err, type) {
            if (err) {
                res.status(400).json({ error: true, message: err });
            } else {
                res.json(type);
            }
        });
    }
};

exports.read_type = function(req, res) {
    Type.getTypeById(req.params.typeId, function(err, type) {
        if (err) {
            res.send(err);
        }
        res.json(type);
    });
};

exports.update_type = function(req, res) {
    Type.updateById(req.params.typeId, new Type(req.body), function(err, type) {
        if (err) {
            res.send(err);
        }
        res.json(type);
    });
};

exports.delete_type = function(req, res) {
    Type.removeById(req.params.typeId, function(err, type) {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Type successfully deleted' });
    });
};