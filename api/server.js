'use strict';

var app = require('./app')
const PORT = 3000

var db_location = '127.0.0.1';
var db_port = '5984';
var db_name = 'iotrough';
module.exports.db_name = db_name;
global.nano = require('nano')({"url" : 'http://' + db_location + ':' + db_port});
global.db       = global.nano.use(db_name);

var server = app.listen(PORT),
io = require('socket.io')(server);


function db_check(callback){
    global.nano.db.get(db_name, function(err,body) {
        if(!err){
            console.log('db exists');
            if (callback && typeof callback=='function'){
                callback(true)
            }
            return;
        } else {
            console.log('get error',err.reason);
            if(err.error=='not_found' && (err.reason=='Database does not exist.' || err.reason=='no_db_file')) {
                global.nano.db.create(db_name,function(e,b){
                    if(!e){
                        console.log('database ' + db_name + ' created');
                        global.db = global.nano.use(db_name)

                        let view_doc = {
                            all_docs:{
                                map: function(doc){if(doc._id!='info'){emit(doc._id,{rev:doc._rev})}}
                            },
                            get_node:{
                                map: function(doc){emit(doc.node.node_id,{rev:doc._rev})}
                            }
                        }

                        let doc = {
                            _id: "info",
                            nodes: []
                        }
                        
                        global.db.insert({views:view_doc,language:"javascript"},'_design/nodes',function(error,body){
                            if(!error){
                                console.log('inserted design document');
                                global.db.insert(doc,function(e,b){
                                    if(!e){
                                        console.log('info document inserted');
                                        if (callback && typeof callback=='function'){
                                            callback(true)
                                        }
                                    } else {
                                        console.log('info doc not inserted');
                                        if (callback && typeof callback=='function'){
                                            callback(true)
                                        }
                                    }
                                    return;
                                })
                            } else {
                                console.log('design error',error.reason)
                            }
                            return;
                        });

                    } else {
                        console.log('create error',e.reason)
                        if (callback && typeof callback=='function'){
                            callback(false)
                        }
                    }
                    return;
                });
            }
        }
    })

}

io.on('connection', function(socket){
    console.log("connection")

    socket.on('db_connect',function(){
        db_check(function(check){
            if(check){
                console.log('connected to database');
                socket.emit('db_connection_resolve',{connection:true, error: 'none'});
            } else {
                console.log('no database connection');
                socket.emit('db_connection_resolve',{connection:false, error: 'no_db_connection'});
            }
        })
    })
    

});

console.info("Servidor listo, en puerto",PORT)