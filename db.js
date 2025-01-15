// DATABASE CONNECTION SETUP 
const mysql = reqire('mysql2');
const pool = mysql.createPool({
    host: 'localhost', // Replace with your DB host
    user: 'root', // Replace with your DB user
    password: '', // Replace with your DB password
    database: 'bincom_test', // Replace with your DB name
})

module.exports = pool.promise();