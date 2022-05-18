const express = require("express");
const fs = require("fs");
const app = express();
const port = 8000;
app.use(express.json());
const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'petshop',
    password: 'password',
    port: 5432,
});

app.get("/pets", async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM pets;')
        res.json(data.rows);
    } catch (err) {
        res.json(err);
    }
});

app.get("/pets/:id", async (req, res) => {
    try {
        const data = await pool.query(`SELECT * FROM pets WHERE id=$1;`, [req.params.id])
        //console.log(`data.length=${data.rows.length}`);
        if (data.rows.length === 0) {
            res.statusCode = 404;
            res.send("not found");
        } else {
            res.json(data.rows);
        }
    } catch (err) {
        res.json(err)
    }
});

app.post("/pets", async (req, res) => {
    try {
        pool.query('INSERT INTO pets (name, age, kind) VALUES ($1, $2, $3);',[req.body.name, req.body.age, req.body.kind]);
        res.json(req.body);
    } catch (error) {
        res.json(error);
    }
});

app.patch("/pets/:id", async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM pets WHERE id=$1;', [req.params.id]);        
        let updateName = req.body.name || data.rows[0].name;
        let updateAge = req.body.age || data.rows[0].age;
        let updateKind = req.body.kind || data.rows[0].kind;
        await pool.query('UPDATE pets SET(name, age, kind) = ($1, $2, $3) WHERE id=$4;', [updateName, updateAge, updateKind, req.params.id]);
        let returnObj = {
            name: `${updateName}`,
            age: `${updateAge}`,
            kind: `${updateKind}`
        }
        res.json(returnObj);
    } catch (error) {
        res.json(error);
    }
});

app.delete("/pets/:id", async (req, res) => {
    try{
        const data = await pool.query('SELECT * FROM pets WHERE id=$1;', [req.params.id]);
        if (data.rows.length === 0) {
            res.statusCode = 404;
            res.send("not found");
        }
        await pool.query('DELETE FROM pets WHERE id=$1;', [req.params.id]);
        res.json(data.rows[0]);
    } catch (error) {
        res.json(error);
    }
});

app.listen(port, function () {
    console.log(`Listening on Port: ${port}`);
});