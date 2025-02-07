const GUN = require('gun');
const express = require('express')
const app = express();
const path = require('path');
const assert = require('assert');
const fs = require('fs');
const formidable = require('express-formidable');
const bodyParser = require('body-parser');
const session = require('cookie-session');

var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.VCAP_APP_PORT || process.env.PORT || process.argv[2] || 8099;

app.use(GUN.serve);
app.use(express.static(__dirname));

// Set to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


var server = app.listen(port);
var gun = GUN({ file: 'data', web: server });
console.log('Server started on port ' + port + ' with /gun');

gun = GUN();

const account = gun.get("accounts");
const tony = account.get("tony");
tony.get("name").put("tony");
tony.get("age").put(22);
tony.get("friend").put("sam");
const sam = account.get("sam");
sam.get("name").put("sam");
sam.get("age").put(22);
sam.get("friend").put("tony");
tony.map().once(res => console.log(res));//nodnode
/*
const userbase = gun.get('user-database');

const createUser = function(name, pw) {
    userid = 0;
    userbase.get('user-database').get('credentials').get(userid).put({
        id: userid,
        username: name,
        password: pw
    });
    userid += 1;
}

const readUser = function(specified_id, name, pw) {
    console.log("Account Information: ");
    userbase.get('user-database').get('credentials').get(specified_id).get('id').once(function(value, key){
        console.log("What is the id?", value);
    }); 
    userbase.get('user-database').get('credentials').get(specified_id).get('username').once(function(value, key){
        console.log("What is the username?", value);
    }); 
    userbase.get('user-database').get('credentials').get(specified_id).get('password').once(function(value, key){
        console.log("What is the password?", value);
    }); 
    console.log("End.");
    console.log(" ");
}

createUser("tony", "113");
createUser("sam", "112");
readUser(1);
readUser(2);

// Add Data
company = gun.get('startup').put({
    name: "hype",
    profitable: false,
    address: {
      street: "123 Hipster Lane",
      city: "San Francisco",
      state: "CA",
      country: "USA"
    }
});

console.log("Add success.")

// Read data
company.get('address').get('city').once(function(value, key){
    console.log("Fetch success.");
    console.log("What is the city?", value);
});

company.get('address').get('street').once(function(value, key){
    console.log("Fetch success.");
    console.log("What is the street?", value);
});

// Delete Data

company.get('address').get('street').put(null);


// Read data
company.get('address').get('street').once(function(value, key){
    console.log("Update success.");
    console.log("What is the street?", value);
});

// CRUD FUNCTIONS for company
const createDoc = function(something) {
    company = gun.get('startup').put(something);
}
const readDoc = function(name, criteria, subcriteria) {
    company.get(name).get(criteria).get(subcriteria).once(function(value, key){
        console.log("What is the city?", value);
    }); 
}
const updateDoc = function(name, criteria, subcriteria, something) {
    company.get(name).get(criteria).get(subcriteria).put(something);
    company.get(name).get(criteria).get(subcriteria).once(function(value, key){
        console.log("What is the city?", value);
    }); 
}
const deleteDoc = function(name, criteria, subcriteria) {
    company.get(name).get(criteria).get(subcriteria).put(null);
    company.get(name).get(criteria).get(subcriteria).once(function(value, key){
        console.log("What is the street?", value);
    }); 
}


readDoc("hype", "address", "city");
readDoc("sans", "address", "city");
readDoc("sans", "address", "street");
deleteDoc("hype", "address", "street");
updateDoc("sans", "address", "city", "Los Angeles");
createDoc({
    name: "sans",
    profitable: false,
    address: {
      street: "308 Negra Arroyo Lane",
      city: "Albuquerque",
      state: "NM",
      country: "USA"
    }
});
*/

app.get('/', function(req, res){
    if(!req.session.authenticated){
        console.log("Please verify yourself. System not in use.");
        res.redirect("/login");
    }else{
    	res.redirect("/login");
    }
});

app.get('/login', function(req, res){
    return res.status(200).render("login");
});

app.post('/login', function(req, res){
    console.log("Loading.");
    for (var i=0; i<usersinfo.length; i++){
        if (usersinfo[i].name == req.body.username && usersinfo[i].password == req.body.password) {
            req.session.authenticated = true;
            req.session.userid = usersinfo[i].name;
            console.log("Session in use by: " + req.session.userid);
            return res.status(200).redirect('/menu');
        }
    }
    console.log("Incorrect login credentials. Access denied.");
    return res.redirect("/");
});

app.get('/home', function(req, res){
    return res.status(200).render("home");
});

// IMPORTANT: 
// npm init
// npm install gun express express-formidable body-parser cookie-session assert
// fs no need to install
// Reference:
// 1. https://medium.com/@golluajay9/building-a-decentralized-chat-app-with-orbitdb-and-libp2p-in-node-js-6404bdd8fbde
// 2. https://github.com/orbitdb/orbitdb/blob/main/docs/GETTING_STARTED.md 