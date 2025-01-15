const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host:'localhost',
    user: 'user-name',
    password:'password',
    database: 'bincom_test'
})

db.connect(err => {
    if(err) {
        throw err
    }
    else console.log('Database connected')
})

app.get('/polling-unit/:id' , (req , res ) => {
    const pollingUnitId = req.params.id;
    const query = `
        SELECT party_abbreviation, party_score
        FROM announced_pu_results
        WHERE polling_unit_uniqueid = ?
    `;

    db.query(query, [pollingUnitId], (err, results) => {
        if (err) throw err;
        res.render('polling_unit', { results });
    });
})

app.get('/lga-results' , (req,res) => {
    const query = 'SELECT lga_id, lga_name FROM lga WHERE state_id = 25';

    db.query(query, (err, lgas) => {
        if (err) throw err;
        res.render('lga_results', { lgas, results: null });
    });
})

app.post('/lga-results', (req,res) => {
    const lgaId = req.body.lga__id;
    const query = `
        SELECT SUM(party_score) AS total_score, party_abbreviation
        FROM announced_pu_results
        WHERE polling_unit_uniqueid IN (
            SELECT uniqueid
            FROM polling_unit
            WHERE lga_id = ?
        )
        GROUP BY party_abbreviation
    `;

    db.query(query, [lgaId], (err, results) => {
        if(err) throw err;

        const lgaQuery = 'SELECT lga_id, lga_name FROM lga WHERE state_id = 25';
        db.query(lgaQuery, (err, lgas) => {
            if(err) throw err;
            res.render('lga_result' , {lgas , results});
        })
    })
})

app.get('/new-polling-unit',(req,res) => {
    res.render('new_polling_unit');
})

app.listen(3000 , () => {
    console.log('Server running on PORT 3000')
})