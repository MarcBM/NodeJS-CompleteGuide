const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: '-K@WK3YJFD6o*Y2_Ue6y'
});

module.exports = pool.promise();