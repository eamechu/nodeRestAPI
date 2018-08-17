/**Import Core Node Modules**/
var express = require('express');
var mysql = require('mysql');
var http = require('http');
var bodyParser = require('body-parser');

var app = express();

/**Parse form input fields to JSON**/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/**Connect to Database */
const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "dbnode"
});

app.get('/', (req, res) => {
    con.query("SELECT * FROM users", function(err, result) {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    });
});

/**User by id */
app.get('/:id', function(req, res) {
    con.query("SELECT * FROM users WHERE id=?", [req.params.id], function(err, result) {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    });
});

//Add user to Database
app.post('/adduser', (req, res) => {
    let postBody = req.body;
    // res.send(parseBody);
    //con.query("INSERT INTO users VALUES(?,?,?,?)", [postBody.name, postBody.phone, postBody.address, postBody.email], function(err, result) {
    con.query("INSERT INTO users SET ?", { name: postBody.name, phone: postBody.phone, address: postBody.address, email: postBody.email }, function(err, result) {
        if (err) {
            res.send("Error saving new user" + "\n" + err);
        } else {
            res.json({ 'result': 'Success', 'data': result });
        }
    });
});

//Update user
app.put('/updateuser/:id', (req, res) => {
    let postBody = req.body;
    con.query("UPDATE users SET name=?,phone=?,address=?,email=? WHERE id='" + req.params.id + "'", [postBody.name, postBody.phone, postBody.address, postBody.email], (err, result) => {
        if (err) {
            res.send("Error Updating user data" + "\n" + err);
        } else {
            res.json({ 'result': result });
        }
    });
});

//Delete User
app.delete('/deleteuser/:id', (req, res) => {
    con.query("DELETE FROM users WHERE id='" + req.params.id + "'", (err, result) => {
        if (err) {
            res.send("Error deleting user \n" + err);
        } else {
            res.send("Record successfully deleted \n" + result);
        }
    });
});

app.listen(4000, function() {
    console.log('Server started on port 4000...');
});