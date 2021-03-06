/**
 * Created with JetBrains WebStorm.
 * User: yzjf
 * Date: 14-2-8
 * Time: 下午4:53
 * To change this template use File | Settings | File Templates.
 */

var baseDb = require('./baseDao');
var m_machine = require('../mode/M_machine');
exports.updataMisc = function (machine, misc, cb) {
    var strSql = "UPDATE `machinebarcode` SET `machinemsic`= " + baseDb.escape(machine.id) +
        " WHERE `idmachinebarcode`= " + baseDb.escape(misc) + " ;";
    baseDb.queryDb(strSql, cb);
};
exports.updataDepartment = function (id, departmentId) {
    var strSql = "";
}
exports.getInfoByTypeDepartment = function (type_id, department_id, logInfo, cb) {
    var strSql = "SELECT " +
        "a.idmachinebarcode id, " +
        "    a.machinemsic misc, "+
        "    a.machinebarcode barcode, " +
        "    b1.department_id, " +
        "    b2.departmentname, " +
        "    c1.type_id, " +
        "    c2.typename " +
        "FROM  " +
        "machinebarcode a " +
        "left join " +
        "department_barcode b1 ON a.idmachinebarcode = b1.barcode_id " +
        "left join " +
        "department b2 ON b2.iddepartment = b1.department_id " +
        "left join " +
        "barcode_type c1 ON a.idmachinebarcode = c1.barcode_id " +
        "left join " +
        "machinetype c2 ON c2.idmachinetype = c1.type_id " +
        "where " ;

    if ( department_id != "" && type_id != "" ){
        strSql += "b1.department_id = " + baseDb.escape(department_id) + " and "+
            "c1.type_id = " + baseDb.escape(type_id) + ";"
    }
    else if ( department_id != "" ){
        strSql += "b1.department_id = " + baseDb.escape(department_id) + ";"
    }
    else if ( type_id != "" ){
        strSql += "c1.type_id = " + baseDb.escape(type_id) + ";"
    }
    baseDb.queryDb(strSql, logInfo, function(err, rows) {
        if (err) {
            cb(err);
            return;
        }
        var re = [];
        for (var  i = 0 ; i < rows.length ; i ++){
            re.push(new m_machine.creatMachine(rows[i]));
        }
        cb(err, re);
    });
}
exports.getInfoByBarcode = function (barcode, logInfo, cb) {
    var strSql = "SELECT " +
        "a.idmachinebarcode id, " +
        "    a.machinemsic misc, "+
        "    a.machinebarcode barcode, " +
        "    b1.department_id, " +
        "    b2.departmentname, " +
        "    c1.type_id, " +
        "    c2.typename " +
        "FROM  " +
        "machinebarcode a " +
        "left join " +
        "department_barcode b1 ON a.idmachinebarcode = b1.barcode_id " +
        "left join " +
        "department b2 ON b2.iddepartment = b1.department_id " +
        "left join " +
        "barcode_type c1 ON a.idmachinebarcode = c1.barcode_id " +
        "left join " +
        "machinetype c2 ON c2.idmachinetype = c1.type_id " +
        "where " +
        "a.machinebarcode = " + baseDb.escape(barcode) + ";"
    baseDb.queryDb(strSql, logInfo, function(err, rows) {
        if (err) {
            cb(err);
            return;
        }
        var re = [];
        for (var  i = 0 ; i < rows.length ; i ++){
            re.push(new m_machine.creatMachine(rows[i]));
        }
        cb(err, re);
    });
}
exports.addMachineByTrans = function (connection, machine, logInfo, cb) {
    var strSql = "INSERT INTO `machinebarcode` (`machinebarcode`, `machinemsic`) VALUES ("+
        baseDb.escape(machine.barCode) +", "+
        baseDb.escape(machine.misc) +");"
    baseDb.queryTransactions(connection, strSql, logInfo, function(err, rows) {
        if (err) {
            cb(err);
            return;
        }
        machine.id = rows.insertId ;
        cb(err, machine);
    });
};
exports.changeMachinemisc = function (connection, machine, logInfo, cb) {
    var strSql = "UPDATE  `machinebarcode` SET `machinemsic`= "+
        baseDb.escape(machine.misc) +" WHERE `idmachinebarcode`="+
        baseDb.escape(machine.id)+"; ";
    baseDb.queryTransactions(connection, strSql, logInfo, function(err, rows) {
        if (err) {
            cb(err);
            return;
        }
        cb(err, machine);
    });
};