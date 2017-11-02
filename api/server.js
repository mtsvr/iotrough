'use strict';

var app = require('./app')
const PORT = 3000



var server = app.listen(PORT),
io = require('socket.io')(server);

io.on('connection', function(socket){
    console.log("connection")
});

console.info("Servidor listo, en puerto",PORT)