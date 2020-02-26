const async = require('async');
const db_pool = require('./mysql_connect.js').getPool();

module.exports.getServerStatus = (callback) => {
    db_pool.getConnection(function(err, db) {
        try {
            if (err) {
                callback(false);
            } else {
                db.beginTransaction(function (err) {
                    if (err) {
                        db.rollback();
                        callback(false);
                    } else {
                        const query = `select * from maskinfo;`;
                        const query_list = [];
                        db.query(query, query_list, function (err, data) {
                            if (err) {
                                callback(false);
                            } else {
                                callback(data[0]);
                            }
                        });
                    }
                });
            }
        } catch(e){}finally{
            db.release();
        }
    });
};

module.exports.getNonCallUserList = (callback) => {
    db_pool.getConnection(function(err, db) {
        try {
            if (err) {
                callback(false);
            } else {
                db.beginTransaction(function (err) {
                    if (err) {
                        db.rollback();
                        callback(false);
                    } else {
                        const query = `select id from User where is_call_user != 1;`;
                        const query_list = [];
                        db.query(query, query_list, function (err, data) {
                            if (err) {
                                callback(false);
                            } else {
                                callback(data);
                            }
                        });
                    }
                });
            }
        } catch(e){}finally{
            db.release();
        }
    });
};

module.exports.deleteMaskList = (callback) => {
    db_pool.getConnection(function(err, db) {
        try {
            if (err) {
                callback(false);
            } else {
                db.beginTransaction(function (err) {
                    if (err) {
                        db.rollback();
                        callback(false);
                    } else {
                        const query = `delete * from masklist;`;
                        const query_list = [];
                        db.query(query, query_list, function (err, data) {
                            if (err) {
                                callback(false);
                            } else {
                                callback(true);
                            }
                        });

                    }
                });
            }
        } catch(e){}finally{
            db.release();
        }
    });
};

module.exports.updateMaskList = (info, callback) => {
    db_pool.getConnection(function(err, db) {
        try {
            if (err) {
                callback(false);
            } else {
                db.beginTransaction(function (err) {
                    if (err) {
                        db.rollback();
                        callback(false);
                    } else {
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
                    }
                });
            }
        } catch(e){}finally{
            db.release();
        }
    });
};


module.exports.initMaskUrl = (info, callback) => {
    db_pool.getConnection(function(err, db) {
        try {
            if (err) {
                callback(false);
            } else {
                db.beginTransaction(function (err) {
                    if (err) {
                        db.rollback();
                        callback(false);
                    } else {
                        let result;
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
                                    const query = "select * from maskurl";
                                    const query_list = [];
                                    db.query(query, query_list, function (err, data) {
                                        if (err) {
                                            console.log(`>>>>5`, err)
                                            db.rollback();
                                            callback(false);
                                        } else {
                                            result = data;
                                            cb(null, null);
                                        }
                                    });
                                },
                                function (cb) {
                                    db.commit(function (err) {
                                        if (err) {
                                            console.log(`>>>>6`, err)
                                            db.rollback();
                                            callback(false);
                                        } else {
                                            cb(null, null);
                                        }
                                    });
                                }
                            ],
                            function (err, results) {
                                callback(result);
                            });
                    }
                });
            }
        } catch(e){}finally{
            db.release();
        }
    });
};

module.exports.getMaskUrl = (callback) => {
    db_pool.getConnection(function(err, db) {
        try {
            if (err) {
                callback(false);
            } else {
                db.beginTransaction(function (err) {
                    if (err) {
                        db.rollback();
                        callback(false);
                    } else {
                        const query = `select * from maskurl;`;
                        const query_list = [];
                        db.query(query, query_list, function (err, data) {
                            if (err) {
                                callback(false);
                            } else {
                                callback(data);
                            }
                        });

                    }
                });
            }
        } catch(e){}finally{
            db.release();
        }
    });
};

module.exports.getMaskList = (callback) => {
    db_pool.getConnection(function(err, db) {
        try {
            if (err) {
                callback(false);
            } else {
                db.beginTransaction(function (err) {
                    if (err) {
                        db.rollback();
                        callback(false);
                    } else {
                        const query = `select * from masklist;`;
                        const query_list = [];
                        db.query(query, query_list, function (err, data) {
                            if (err) {
                                callback(false);
                            } else {
                                callback(data);
                            }
                        });
                    }
                });
            }
        } catch(e){}finally{
            db.release();
        }
    });
};