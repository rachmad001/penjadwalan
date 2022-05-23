var pool = require('../DatabaseConnection');
var hashing = require('../hashing');
var tokenSecret = process.env.SECRET_TOKEN;
var jwt = require('jsonwebtoken');

var express = require('express');
var router = express.Router();

router.post('/tambahAkses/Admin', (req, res) => {
    var data = req.body;
    try {
        var decoded = jwt.verify(req.headers.token, tokenSecret);
        pool.query(
            'select * from access where "user"=$1 and kalender=$2 and status=$3',
            [decoded, data.id_kalender, 'owner'],
            (error, results) => {
                if (error){
                    res.json({
                        status: false,
                        message: error.message
                    })
                }else {
                    if(results.rowCount > 0){
                        addAnggota(data.username, data.id_kalender, 'admin', res);
                    }else {
                        res.json({
                            status: false,
                            message: 'anda bukan owner'
                        })
                    }
                }
            }
        )
    } catch (error) {
        res.json({
            status: false,
            message: 'token tidak ditemukan'
        })
    }
})

router.post('/tambahAkses/request', (req, res) => {
    var data = req.body;
    try {
        var decoded = jwt.verify(req.headers.token, tokenSecret);
        pool.query(
            'select * from access where "user"=$1',
            [decoded],
            (error, results) => {
                if(error){
                    res.json({
                        status: false,
                        message: error.message
                    })
                } else {
                    if (results.rowCount > 0){
                        if(results.rows[0].status === 'owner' || results.rows[0].status === 'admin'){
                            res.json({
                                status: false,
                                message: 'anda sudah menjadi '+results.rows[0].status
                            })
                        } else {
                            res.json({
                                status: false,
                                message: 'anda sudah mengirimkan request'
                            })
                        }
                    } else {
                        addAnggota(decoded, data.id_kalender, 'request', res);
                    }
                }
            }
        )
    } catch (error) {
        res.json({
            status: false,
            message: 'token tidak ditemukan'
        })
    }
})

router.put('/tambahAkses/controlRequest', (req, res) => {
    var data = req.body;
    try {
        var decoded = jwt.verify(req.headers.token, tokenSecret);
        pool.query(
            'select * from access where id=$1',
            [data.id_access],
            (error, results) => {
                if(error){
                    res.json({
                        status: false,
                        message: error.message
                    })
                } else {
                    if(results.rowCount > 0){
                        if(results.rows[0].status === 'request'){
                            updateRequest(data.id_access, data.status, decoded, results.rows[0].kalender, res);
                        } else {
                            res.json({
                                status: false,
                                message: 'user sudah berstatus '+results.rows[0].status
                            })
                        }
                    } else {
                        res.json({
                            status: false,
                            message: 'id tidak ditemukan'
                        })
                    }
                }
            }
        )
    } catch (error) {
        res.json({
            status: false,
            message: 'token tidak ditemukan'
        })
    }
})

router.get('/getAkses', (req, res) => {
    try {
        var decoded = jwt.verify(req.query.token, tokenSecret);
        pool.query(
            'select * from access where "user"=$1',
            [decoded],
            (error, results) => {
                if(error){
                    res.json({
                        status: false,
                        message: error.message
                    })
                }else {
                    res.json({
                        status: true,
                        data: results.rows
                    })
                }
            }
        )
    } catch (error) {
        res.json({
            status: false,
            message: 'token tidak ditemukan'
        })
    }
})

router.get('/getListRequest', (req, res) =>{
    try {
        var decoded = jwt.verify(req.query.token, tokenSecret);
        pool.query(
            'select * from access where "user"=$1 and kalender=$2 and status=$3',
            [decoded, req.query.kalender, 'owner'],
            (error, results) => {
                if(results.rowCount > 0){
                    getListRequest(req.query.kalender,'request', res);
                }else {
                    res.json({
                        status: false,
                        message: 'anda bukan owner'
                    })
                }
            }
        )
    } catch (error) {
        res.json({
            status: false,
            message: 'token tidak ditemukan'
        })
    }
})

router.get('/getListAdmin', (req, res) => {
    try {
        var decoded = jwt.verify(req.query.token, tokenSecret);
        pool.query(
            'select * from access where "user"=$1 and kalender=$2 and status=$3',
            [decoded, req.query.kalender, 'owner'],
            (error, results) => {
                if(results.rowCount > 0){
                    getListRequest(req.query.kalender, 'admin', res);
                }else {
                    res.json({
                        status: false,
                        message: 'anda bukan owner'
                    })
                }
            }
        )
    } catch (error) {
        res.json({
            status: false,
            message: 'token tidak ditemukan'
        })
    }
})

router.delete('/hapusAdmin', (req, res) => {
    var data = req.body;
    try {
        var decoded = jwt.verify(req.headers.token, tokenSecret);
        pool.query(
            'select * from access where "user"=$1 and kalender=$2 and status=$3',
            [decoded, data.id_kalender, 'owner'],
            (error, results) => {
                if(error){
                    res.json({
                        status: false,
                        message: error.message
                    })
                }else {
                    if(results.rowCount > 0){
                        deleteAdmin(data.id_access_admin, data.id_kalender, res);
                    } else {
                        res.json({
                            status: false,
                            message: 'anda bukan owner'
                        })
                    }
                }
            }
        )
    } catch (error) {
        res.json({
            status: false,
            message: 'token tidak ditemukan'
        })
    }
})

function addAnggota(user, kalender, status, res){
    pool.query(
        'insert into access("user", kalender, status) values($1, $2, $3) returning *',
        [user, kalender, status],
        (error, results) => {
            if(error){
                res.json({
                    status: false,
                    message: error.message
                })
            }else {
                res.json({
                    status: true,
                    message: 'berhasil menambahkan '+status,
                    data: results.rows
                })
            }
        }
    )
}

function updateRequest(id, status, owner, kalender, res){
    pool.query(
        'select * from access where "user"=$1 and kalender=$2 and status=$3',
        [owner, kalender, 'owner'],
        (error, results) => {
            if(error){
                res.json({
                    status: false,
                    message: error.message
                })
            }else {
                if(results.rowCount > 0){
                    confirmAnggota(id, status, res);
                } else {
                    res.json({
                        status: false,
                        message: 'anda bukan owner'
                    })
                }
            }
        }
    )
}

function confirmAnggota(id, status, res){
    if(status === 'terima'){
        pool.query(
            'update access set status=$1 where id=$2 returning *',
            ['admin', id],
            (error, results) => {
                if(error){
                    res.json({
                        status: false,
                        message: error.message
                    })
                } else {
                    res.json({
                        status: true,
                        message: 'berhasil menerima user',
                        data: results.rows
                    })
                }
            }
        )
    } else {
        pool.query(
            'delete from access where id=$1 returning *',
            [id],
            (error, results) => {
                if(error){
                    res.json({
                        status: false,
                        message: error.message
                    })
                }else {
                    res.json({
                        status: true,
                        message: 'berhasil menolak request',
                        data: results.rows
                    })
                }
            }
        )
    }
}

function deleteAdmin(id, id_kalender, res){
    pool.query(
        'delete from access where id=$1 and kalender=$2 returning *',
        [id, id_kalender],
        (error, results) => {
            if(error){
                res.json({
                    status: false,
                    message: error.message
                })
            }else {
                if(results.rowCount > 0){
                    res.json({
                        status: true,
                        message: 'berhasil menghapus admin',
                        data: results.rows
                    })
                }else {
                    res.json({
                        status: false,
                        message: 'admin tidak ditemukan'
                    })
                }
            }
        }
    )
}

function getListRequest(kalender, status, res){
    pool.query(
        'select * from access where kalender=$1 and status=$2',
        [kalender, status],
        (error, results) => {
            res.json({
                status: true,
                data: results.rows
            })
        }
    )
}

module.exports = router;