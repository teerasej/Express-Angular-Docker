'use strict'

// let mongoIP = '172.17.0.2:27017';

let mongoIP = 'mongo:27017';

let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
let db = require('monk')(mongoIP + '/employee');


let app = express();

// View engine
app.set('view engine', 'pug');
app.set('views', './views')

// Middleware 

app.use((req, res, next) => {
    req.db = db;
    next();
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'dist')));


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// Routing
// app.get('/', (req, res)=> {
//     res.render('index', { username: "Pon"});
// })

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.get('/employee', (req, res) => {

    let collection = req.db.get('users');

    collection
        .find()
        .then(docs => {
            res.json(docs);
            // res.render('employee', { employees: docs });
        })
        .catch(error => { res.send(error) });

})

app.get('/employee/:id', (req, res) => {
    let employeeId = req.params.id;
    res.send("Employee id:" + employeeId);
});
app.post('/sign-in', (req, res) => {

    let username = req.body.username;
    let password = req.body.password;

    res.send("");
})

app.post('/employee/create', (req, res) => {

    let name = req.body.name;
    console.log('Creating user: ' + name);
    let collection = req.db.get('users');


    collection
        .insert({ name: name })
        .then(docs => { res.json(docs) })
        .catch(error => { })
})

app.delete('/employee', (req, res, next) => {

    let id = req.body.id;
    let collection = req.db.get('users');

    collection
        .remove({ _id: id })
        .then(docs => { })
        .catch(error => { })

})

app.post('/employee/sync-array', (req, res, next) => {

    let employeeArray = req.body.employeeArray;

    let collection = req.db.get('users');

    collection
        .insert(employeeArray)
        .then(docs => { res.json(docs) })
        .catch(error => { res.send(error) })

})

let server = app.listen(3000, () => {
    console.log('...');
    console.log("Server running at localhost:3000");
    console.log('MongoDB IP: ' + mongoIP);
})