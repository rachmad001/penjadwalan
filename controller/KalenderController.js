var pool = require('../DatabaseConnection');
var hashing = require('../hashing');
var tokenSecret = process.env.SECRET_TOKEN;
var jwt = require('jsonwebtoken');

var express = require('express');
const res = require('express/lib/response');
var router = express.Router();

router.post('/tambahKalender', (req, res) => {
    var data = req.body;
    try {
        var decoded = jwt.verify(req.headers.token, tokenSecret);
        makeId(data.judul, decoded, res);
    } catch (error) {
        res.json({
            status: false,
            message: 'token tidak ditemukan'
        })      
    }
})

router.put('/editKalender', (req, res) => {
    var data = req.body;
    try {
        var decoded = jwt.verify(req.headers.token, tokenSecret);
        pool.query(
            'update kalender set judul=$1 where id=$2 and pemilik=$3 returning *',
            [data.judul_baru, data.id, decoded],
            (error, results) => {
                if (error){
                    res.json({
                        status: false,
                        message: error.message
                    })
                } else {
                    res.json({
                        status: true,
                        message: 'berhasil mengubah kalender',
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

router.get('/getKalender', (req, res) => {
    try {
        var decoded = jwt.verify(req.query.token, tokenSecret);
        pool.query(
            'select * from kalender where pemilik=$1',
            [decoded],
            (error, results) => {
                res.json({
                    status: true,
                    data: results.rows
                })
            }
        )
    } catch (error) {
        res.json({
            status: false,
            message: 'token tidak ditemukan'
        })
    }
})

router.delete('/hapusKalender', (req, res) => {
    var data = req.body;
    try {
        var decoded = jwt.verify(req.headers.token, tokenSecret);
        pool.query(
            'select * from kalender where id=$1 and pemilik=$2',
            [data.id_kalender, decoded],
            (error, results) => {
                if(error){
                    res.json({
                        status: false,
                        message: error.message
                    })
                }else {
                    if(results.rowCount > 0){
                        pool.query('delete from access where kalender=$1',[data.id_kalender]);
                        pool.query('delete from jadwal where kalender=$1',[data.id_kalender]);
                        pool.query('delete from kalender where id=$1',[data.id_kalender]);
                        res.json({
                            status: true,
                            message: 'berhasil menghapus kalender'
                        })
                    }else {
                        res.json({
                            status: false,
                            message: 'kalender tidak ditemukan atau anda bukan owner'
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

function makeId(judul, pemilik, res){
    var id = hashing.generateString(6);
    console.log('id : '+id);
    pool.query(
        'insert into kalender(id, judul, pemilik) values($1,$2,$3)',
        [id, judul, pemilik],
        (error, results) => {
            if(error){
                makeId(judul, pemilik, res);
                console.log(error.message);
            } else {
                insertAcces(pemilik, id, 'owner', res, id, judul, pemilik);
            }
        }
    )
}

function insertAcces(user, idKalender, status, res, id, judul, pemilik){
    pool.query(
        'insert into access("user", kalender, status) values($1, $2, $3)',
        [user, idKalender, status],
        (error, results) => {
            if(error){
                res.json({
                    status: false,
                    message: error.message
                })
            } else {
                res.json({
                    status: true,
                    message: 'berhasil menambahkan',
                    data: {
                        id: id,
                        judul: judul,
                        pemilik: pemilik
                    }
                });
            }
        }
    )
}

function deleteKalender(id){
    
}
module.exports = router;