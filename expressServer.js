const { response } = require('express');
const express = require('express');
var fs = require('fs');
const app = express();
app.use(express.static("static"));

const PORT = 8000;

function read(res, next) {
    fs.readFile('pets.json', 'utf8', function (error, data) {
        if (error) {
            next({ status: 500, message: `${error}` });
        } else {
            let currentData = JSON.parse(data);
            res.status(200);
            res.send(currentData);
        }
    });
}

function readAt(num, res, next) {
    fs.readFile('pets.json', 'utf8', function (error, data) {
        if (error) {
            next({ status: 500, message: "Internal Server Error" });
        } else {
            let currentData = JSON.parse(data)
            if (num < 0 || num > currentData.length - 1) {
                next({ status: 404, message: "Usage: node pets.js read INDEX" });
            } else {
                res.status(200)
                res.send(currentData[num])
            }
        }
    })
}

function create(res, age, kind, name, next) {
    fs.readFile('pets.json', 'utf8', function (error, data) {
        if (error) {
            next({ status: 500, message: "Internal Server Error" });
        } else {
            let currentData = JSON.parse(data);
            const obj = {
                age: parseInt(age),
                kind: `${kind}`,
                name: `${name}`
            }
            currentData.push(obj);
            let stringVar = JSON.stringify(currentData);
            fs.writeFile('pets.json', stringVar, function (error) {
                if (error) {
                    next({ status: 500, message: "Internal Server Error" });
                } else {
                    res.status(200)
                    res.send(currentData[currentData.length - 1]);
                }
            })
        }
    });
}

app.get('/pets', function (req, res, next) {
    read(res, next);
})
app.get('/pets/:id', function (req, res, next) {
    readAt(req.params.id, res, next);
})

app.get('/', function (req, res, next) {
    next({ status: 404, message: "Not Found" });
})
app.get('/boom', function (req, res, next) {
    next({ status: 500, message: "Internal Server Error" });
})

app.post('/pets%20:age%20:kind%20:name', function (req, res, next) {
    create(res, req.params.age, req.params.kind, req.params.name, next);
})

app.use((err, req, res, next) => {
    res.status(err.status).send(err.message)
})

app.listen(PORT, function () {
    console.log('server is running (go catch it)');
})