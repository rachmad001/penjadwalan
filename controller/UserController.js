var pool = require('../DatabaseConnection');
var hashing = require('../hashing');
var tokenSecret = process.env.SECRET_TOKEN;
var jwt = require('jsonwebtoken');

var express = require('express');
var router = express.Router();

router.post('/signup', (req, res) => {
    var data = req.body;
    var password = hashing.encrypt(data.password);

    pool.query(
        'INSERT INTO "user" (nama_lengkap, ttl, no_hp, email, username, password) values ($1,$2,$3,$4,$5,$6)',
        [data.nama, data.tanggal_lahir, data.no_hp, data.email, data.username, password],
        (error, results) => {
            if (error) {
                console.log(error);
                res.json({
                    status: false,
                    message: 'username sudah digunakan'
                })
            } else {
                var token = jwt.sign(data.username, tokenSecret);
                res.json({
                    status: true,
                    message: 'berhasil menambahkan account',
                    data: {
                        nama_lengkap: data.nama,
                        tanggal_lahir: data.tanggal_lahir,
                        no_hp: data.no_hp,
                        email: data.email,
                        username: data.username,
                        password: password,
                        token: token
                    }
                })
            }
        }
    )
});

router.post('/login', (req, res) => {
    var data = req.body;
    pool.query(
        'select * from "user" where username=$1 OR password = $2',
        [data.username, data.password],
        (error, results) => {
            if (error) {
                console.log(error.message)
            } else {
                if (results.rowCount < 1) {
                    res.json({
                        status: false,
                        message: 'username atau password salah'
                    })
                } else {
                    if (data.password === hashing.decrypt(results.rows[0].password)) {
                        var users = results.rows[0];
                        var token = jwt.sign(users.username, tokenSecret);
                        res.json({
                            status: true,
                            message: 'berhasil login',
                            data: {
                                nama_lengkap: users.nama_lengkap,
                                tanggal_lahir: users.ttl,
                                no_hp: users.no_hp,
                                email: users.email,
                                username: users.username,
                                password: users.password,
                                token: token
                            }
                        })
                    } else {
                        res.json({
                            status: false,
                            message: 'username atau password salah'
                        })
                    }
                }
            }
        }
    )
})

router.put('/editProfil', (req, res) => {
    var data = req.body;
    try {
        var decoded = jwt.verify(req.headers.token, tokenSecret);
        pool.query(
            'update "user" set nama_lengkap=$1, ttl=$2, no_hp=$3, email=$4 where username=$5',
            [data.nama_lengkap, data.tanggal_lahir, data.no_hp, data.email, decoded],
            (error, results) => {
                if (error) {
                    res.json({
                        status: false,
                        message: error.message
                    })
                } else {
                    res.json({
                        status: true,
                        message: 'berhasil mengubah data',
                        data: {
                            nama_lengkap: data.nama_lengkap,
                            tanggal_lahir: data.tanggal_lahir,
                            no_hp: data.no_hp,
                            email: data.email
                        }
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

router.put('/editProfil/password', (req, res) => {
    var data = req.body;
    try {
        var decoded = jwt.verify(req.headers.token, tokenSecret);
        checkPasswordUser(data.password_lama, decoded).then(
            (value) => {
                var newPassword = hashing.encrypt(data.password_baru);
                if (value.status) {
                    pool.query(
                        'UPDATE "user" set password=$1 where username=$2',
                        [newPassword, decoded],
                        (error, results) => {
                            if (error) {
                                res.json({
                                    status: false,
                                    message: error.message
                                })
                            } else {
                                res.json({
                                    status: true,
                                    message: 'berhasil mengubah password',
                                    data: {
                                        password: newPassword
                                    }
                                })
                            }
                        }
                    )
                } else {
                    res.json(value);
                }
            },
            (error) => {
                console.log(error);
            }
        )

    } catch (error) {
        console.log(error);
        res.json({
            status: false,
            message: 'token tidak ditemukan'
        })
    }
})

router.delete('/deleteAccount', (req, res) => {

})
async function checkPasswordUser(password, username) {
    try {
        var results = await pool.query('SELECT * FROM "user" where username=$1', [username]);
        if (results.rowCount < 1) {
            var balikan = {
                status: false,
                message: 'user tidak ditemukan'
            }
            return balikan;
        } else {
            if (password === hashing.decrypt(results.rows[0].password)) {
                var balikan = {
                    status: true,
                    message: 'password lama sesuai'
                }
                return balikan;
            } else {
                var balikan = {
                    status: false,
                    message: 'password lama tidak sesuai'
                }
                return balikan;
            }
        }
    } catch (error) {
        return error.message;
    }
}
module.exports = router;