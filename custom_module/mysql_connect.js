var mysql = require('mysql');

module.exports.mysqlconfig = {
    host : "localhost",
    port : "3306",
    user : "root",
    password : "root",
    database : "mask",
    connectionLimit:100,
    waitForConnections:true
};

const db_pool = mysql.createPool(module.exports.mysqlconfig);
module.exports.getDB=function(options){
    let {callback, fail_val, is_transaction} = options;
    if (!callback || typeof(callback) != 'function') callback = function() {};
    return new Promise(function (resolve, reject) {
        db_pool.getConnection(function(err, db){
            if (err) {
                callback(fail_val);
                reject();
            } else {
                if (is_transaction) {
                    db.beginTransaction(function(err){
                        if (err){
                            db.rollback();
                            callback(fail_val);
                            reject();
                        } else {
                            resolve([db, function() {
                                db.rollback(); // 자동 롤백
                                db.release(); // 자동 release
                                if (typeof(callback) == "function") callback.apply(null, arguments);
                            }]);
                        }
                    });
                } else {
                    resolve([db, function() {
                        db.release(); // 자동 release
                        if (typeof(callback) == "function") callback.apply(null, arguments);
                    }]);
                }
            }
        });
    });
}
