const getDB = require('./mysql_connect.js').getDB;
const async = require('async');

module.exports.getServerStatus = (cb__) => {
    getDB({
        callback: cb__,
        fail_val: false,
        is_transaction: false
    }).then(([db, callback]) => {
        const query = `select * from maskinfo;`;
        const query_list = [];
        db.query(query, query_list, function (err, data) {
            if (err) {
                callback(false);
            } else {
                callback(data[0]);
            }
        });
    });
};

module.exports.getNonCallUserList = (cb__) => {
    getDB({
        callback: cb__,
        fail_val: false,
        is_transaction: false
    }).then(([db, callback]) => {
        const query = `select id from User where is_call_user != 1;`;
        const query_list = [];
        db.query(query, query_list, function (err, data) {
            if (err) {
                callback(false);
            } else {
                callback(data);
            }
        });
    });
};

module.exports.updateMaskList = (info, cb__) => {
    getDB({
        callback: cb__,
        fail_val: false,
        is_transaction: true
    }).then(([db, callback]) => {
        async.series([
                function (cb) {
                    const query = "delete from masklist";
                    const query_list = [];
                    db.query(query, query_list, function (err) {
                        if (err) {
                            db.rollback();
                            callback(false);
                        } else {
                            cb(null, null);
                        }
                    });
                },
                function (cb) {
                    async.eachSeries(info, function (item, cb2) {
                            const {name, url, etc} = item;
                            const query = "insert into masklist values(?, ?, ?);";
                            const query_list = [name, url, etc];
                            db.query(query, query_list, (err, result) => {
                                if (err) {
                                    db.rollback();
                                    callback(false);
                                } else {
                                    cb2();
                                }
                            });
                        },
                        function (err) {
                            cb(null, null);
                        });
                },
                function (cb) {
                    db.commit(function (err) {
                        if (err) {
                            db.rollback();
                            callback(false);
                        } else {
                            cb(null, null);
                        }
                    });
                }
            ],
            function (err, results) {
                callback(true);
            });
    });
};


module.exports.initMaskUrl = (info, cb__) => {
    getDB({
        callback: cb__,
        fail_val: false,
        is_transaction: true
    }).then(([db, callback]) => {
        async.series([
                function (cb) {
                    const query = "delete from maskurl";
                    const query_list = [];
                    db.query(query, query_list, function (err) {
                        if (err) {
                            db.rollback();
                            callback(false);
                        } else {
                            cb(null, null);
                        }
                    });
                },
                function (cb) {
                    async.eachSeries(info, function (item, cb2) {
                            const {name, url, etc} = item;
                            const query = "insert into maskurl values(?, ?, ?);";
                            const query_list = [name, url, etc];
                            db.query(query, query_list, (err, result) => {
                                if (err) {
                                    db.rollback();
                                    callback(false);
                                } else {
                                    cb2();
                                }
                            });
                        },
                        function (err) {
                            cb(null, null);
                        });
                },
                function (cb) {
                    db.commit(function (err) {
                        if (err) {
                            db.rollback();
                            callback(false);
                        } else {
                            cb(null, null);
                        }
                    });
                }
            ],
            function (err, results) {
                callback(true);
            });
    });
};

module.exports.getMaskUrl = (cb__) => {
    getDB({
        callback: cb__,
        fail_val: false,
        is_transaction: false
    }).then(([db, callback]) => {
        const query = `select * from maskurl;`;
        const query_list = [];
        db.query(query, query_list, function (err, data) {
            if (err) {
                callback(false);
            } else {
                callback(data);
            }
        });
    });
};

module.exports.getMaskList = (cb__) => {
    getDB({
        callback: cb__,
        fail_val: false,
        is_transaction: false
    }).then(([db, callback]) => {
        const query = `select * from masklist;`;
        const query_list = [];
        db.query(query, query_list, function (err, data) {
            if (err) {
                callback(false);
            } else {
                callback(data);
            }
        });
    });
};