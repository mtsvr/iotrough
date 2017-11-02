'use strict'

var path = require("path"),  
express = require("express");

var app = express();

const DIST_DIR = path.join(__dirname, "../app/build");

//Serving the files on the dist folder
app.use(express.static(DIST_DIR));

app.get("*", function (req, res) {  
    res.sendFile(path.join(DIST_DIR, "index.html"));
});

module.exports = app
