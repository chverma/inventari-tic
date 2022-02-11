'user strict';
var sql = require('./db.js');

// Type object constructor
var Type = function(type) {
    this.descripcio = type.descripcio;
};

Type.createType = function(newType, result) {
    sql.query('INSERT INTO types set ?', newType, function(err, res) {
        if (err) {
            console.error('error: ', err);
            result(err, null);
        } else {
            newType.type_id = res.insertId;
            result(null, newType);
        }
    });
};

Type.getTypeById = function(typeId, result) {
    sql.query('Select * from types where type_id = ? ', typeId, function(err, res) {
        if (err) {
            console.error('error: ', err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

Type.getAllType = function(result) {
    sql.query('Select * from types', function(err, res) {
        if (err) {
            console.error('error: ', err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};

Type.updateById = function(id, type, result) {
    sql.query('UPDATE types SET ? WHERE type_id = ?', [type, id], function(err, res) {
        if (err) {
            console.error('error: ', err);
            result(null, err);
        } else {
            result(null, type);
        }
    });
};

Type.removeById = function(id, result) {
    sql.query('DELETE FROM types WHERE type_id = ?', [id], function(err, res) {
        if (err) {
            console.error('error: ', err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};

module.exports = Type;