const express = require('express');
// var http = require('http');

// var db_location = '192.168.1.111';
var db_location = '127.0.0.1';
// var db_location = '192.168.1.89';

var db_port = '5984';
// var db_name = 'sage_test';
var db_name = 'iotrough';

var app = module.exports = express();
module.exports.db_name = db_name;

app.use(express.static('./'));
app.use(express.static('dist'));

const port = process.env.PORT || 3000;
// initialize render helper

//require('../app/routes')(app);

global.nano = require('nano')({
    
        "url" : 'http://' + db_location + ':' + db_port
    });

global.coNano   = require('co-nano')(global.nano);
global.db       = global.coNano.use(db_name);


// This must come after last app.use()
var server = require('http').Server(app.callback()),
    io = require('socket.io')(server);

// Sirviendo el bundle.js de webpack
var path_route = path.resolve(__dirname, path.normalize('../../app/build/'));
app.use(serve(path_route));

io.on('connection', co.wrap( function*(socket){
    console.log("connection")
}));

app.listen(port, () => {
  console.log('app listening on', port);
});
