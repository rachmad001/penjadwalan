var pool = require('../DatabaseConnection');
var hashing = require('../hashing');
var tokenSecret = process.env.SECRET_TOKEN;
var jwt = require('jsonwebtoken');

var express = require('express');
var router = express.Router();

router.post('/tambahJadwal', (req, res) => {
    var data = req.body;
    try {
        var decoded = jwt.verify(req.headers.token, tokenSecret);
        pool.query(
            'select * from access where "user"=$1 and kalender=$2 and status=$3 or "user"=$1 and kalender=$2 and status=$4',
            [decoded, data.id_kalender, 'owner', 'admin'],
            (error, results) => {
                if(error){
                    res.json({
                        status: false,
                        message: error.message
                    })
                }else {
                    if(results.rowCount > 0){
                        tambahJadwal(data.id_kalender, data.judul, data.tanggal_mulai, data.tanggal_berakhir, data.metode, res)
                    }else {
                        res.json({
                            status: false,
                            message: 'gagal menambahkan jadwal, anda bukan owner atau admin'
                        })
                    }
                }
            }
        )
    } catch (error) {
        res.json({
            status: false,
            message: error.message
        })
    }
})

router.put('/editJadwal', (req, res) => {
    var data = req.body;
    try {
        var decoded = jwt.verify(req.headers.token, tokenSecret);
        pool.query(
            'select * from access where "user"=$1 and kalender=$2 and status=$3 or "user"=$1 and kalender=$2 and status=$4',
            [decoded, data.id_kalender, 'owner', 'admin'],
            (error, results) => {
                if(results.rowCount > 0){
                    editJadwal(data.id_jadwal, data.id_kalender, data.judul, data.tanggal_mulai, data.tanggal_berakhir, data.metode, res);
                }else {
                    res.json({
                        status: false,
                        message: 'gagal mengubah jadwal, anda bukan owner atau admin'
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

router.delete('/hapusJadwal', (req, res) => {
    var data = req.body;
    try {
        var decoded = jwt.verify(req.headers.token, tokenSecret);
        pool.query(
            'select * from access where "user"=$1 and kalender=$2 and status=$3 or "user"=$1 and kalender=$2 and status=$4',
            [decoded, data.id_kalender, 'owner', 'admin'],
            (error, results) => {
                if(results.rowCount > 0){
                    hapusJadwal(data.id_jadwal, data.id_kalender, res);
                }else {
                    res.json({
                        status: false,
                        message: 'gagal menghapus jadwal, anda bukan owner atau admin'
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

router.get('/getJadwal', (req, res) => {
    pool.query(
        'select * from jadwal where kalender=$1',
        [req.query.kalender],
        (error, results) => {
            if(results.rowCount > 0){
                res.json({
                    status: true,
                    data: results.rows
                })
            }else {
                res.json({
                    status: false,
                    message: 'data tidak ditemukan'
                })
            }
        }
    )
})

function tambahJadwal(kalender, judul, tanggal_mulai, tanggal_berakhir, metode, res){
    pool.query(
        'insert into jadwal(kalender, judul, tanggal_mulai, tanggal_berakhir, metode) values($1,$2,$3,$4,$5) returning *',
        [kalender, judul, tanggal_mulai, tanggal_berakhir, metode],
        (error, results) => {
            if(error){
                res.json({
                    status: false,
                    message: error.message
                })
            }else {
                res.json({
                    status: true,
                    message: 'berhasil menambahkan jadwal',
                    data: results.rows
                })
            }
        }
    )
}

function editJadwal(id, kalender, judul, tanggal_mulai, tanggal_berakhir, metode, res){
    pool.query(
        'update jadwal set judul=$1, tanggal_mulai=$2, tanggal_berakhir=$3, metode=$4 where id=$5 and kalender=$6 returning *',
        [judul, tanggal_mulai, tanggal_berakhir, metode, id, kalender],
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
                        message: 'berhasil mengubah data',
                        data: results.rows
                    })
                }else {
                    res.json({
                        status: false,
                        message: 'data yang ingin diubah tidak ditemukan'
                    })
                }
            }
        }
    )
}

function hapusJadwal(id, kalender, res){
    pool.query(
        'delete from jadwal where id=$1 and kalender=$2 returning *',
        [id, kalender],
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
                        message: 'berhasil menghapus jadwal',
                        data: results.rows
                    })
                }else {
                    res.json({
                        status: false,
                        message: 'data yang ingin dihapus tidak ditemukan'
                    })
                }
            }
        }
    )
}

module.exports = router;