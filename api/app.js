'use strict'

var path = require("path"),  
express = require("express");

var app = express();

const DIST_DIR = path.join(__dirname, "../app/build");

//Serving the files on the dist folder
app.use(express.static(DIST_DIR));

var db_location = '127.0.0.1';
var db_port = '5984';
var db_name = 'iotrough';

module.exports.db_name = db_name;

global.nano = require('nano')({"url" : 'http://' + db_location + ':' + db_port});

global.db       = global.nano.use(db_name);

app.get("*", function (req, res) {  
    res.sendFile(path.join(DIST_DIR, "index.html"));
});

module.exports = app
