// EXPRESS SERVER SETUP 
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 3000;
app.use(bodyParser.json());
app.use(express.static('Client'));
// app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/polling-unit/:id' , async (req , res) => {
    const { id } = req.params;
    try{
        const [result] = await db.query(
            `
            SELECT party_abbreviation, party_score 
             FROM announced_pu_results 
             WHERE polling_unit_uniqueid = ?
            `
            [id]
        );
        res.json(result)
    } catch (errors) {
        res.status(500).send('There is an getting polling unit results');
    }
});

app.get('/api/lga/:id' , async (req,res) => {
    const {id} = req.params;
    try{
        const [results] = await db.query(
            `SELECT party_abbreviation, SUM(party_score) AS total_score 
             FROM announced_pu_results 
             WHERE polling_unit_uniqueid IN (
                 SELECT uniqueid FROM polling_unit WHERE lga_id = ?
             )
             GROUP BY party_abbreviation`,
            [id]
        );
        res.json(results);
    } catch(error){
        res.status(500).send('There is an error getting LGA results');
    }
});

app.post('/api/polling-unit', async (req,res) => {
    const {uniqueid , results} = req.body;
    try{
        for(const result of result){
            await db.query(
                `INSERT INTO announced_pu_results 
                (polling_unit_uniqueid, party_abbreviation, party_score) 
                VALUES (?, ?, ?)`,
               [uniqueid, result.party, result.score]
            );
        }
        res.send('Successfully saved');
    } catch (error){
        res.status(500).send('There is an error saving polling unit results')
    }
})


app.listen(PORT , () => {
    console.log('Server running on PORT 3000')
})