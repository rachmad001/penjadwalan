var Pool = require('pg').Pool
var pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'penjadwalan',
    password: 'qazwsx12',
    port: 5432
})
module.exports = pool;