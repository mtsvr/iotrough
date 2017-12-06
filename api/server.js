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
                                map: function(doc){if(doc._id!='info' && doc._id!='config'){emit(doc._id,{rev:doc._rev})}}
                            },
                            get_node:{
                                map: function(doc){emit(doc.node.node_id,{rev:doc._rev})}
                            }                  
                        }

                        let doc = {
                            _id: "info",
                            nodes: []
                        }

                        let config = {
                            _id: "config",
                            period : 7,
                            sensors : {
                                sph: {
                                    ideal : 7,
                                    warning_min: 6.5,
                                    warning_max: 7.5,
                                    alert_min: 6,
                                    alert_max: 8
                                },
                                sec: {
                                    ideal: 0,
                                    warning: 10000,
                                    alert: 14000 
                                },
                                tem: {
                                    ideal: 22,
                                    warning_min: 18,
                                    warning_max:26,
                                    alert_min:17,
                                    alert_max: 27
                                },
                                lvl: {
                                    ideal: 3,
                                    warning: 2,
                                    alert: 0
                                }
                            }  
                        }
                        
                        global.db.insert({views:view_doc,language:"javascript"},'_design/nodes',function(error,body){
                            if(!error){
                                console.log('inserted design document');
                                global.db.insert(doc,function(e,b){
                                    if(!e){
                                        console.log('info document inserted');
                                        global.db.insert(config,function(_e,_b){
                                            if(!_e){
                                                console.log('config document inserted');
                                                if (callback && typeof callback=='function'){
                                                    callback(true)
                                                }
                                            }
                                            else {
                                                console.log('config document nor inserted');
                                                if (callback && typeof callback=='function'){
                                                     callback(false)
                                                }
                                            }
                                            return;
                                        })
                                    } else {
                                        console.log('info doc not inserted');
                                        if (callback && typeof callback=='function'){
                                            callback(false)
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

function sortDocByTimestamp(a,b){
    return(b.doc.time-a.doc.time)
}

function sortDocByTimestampReverse(a,b){
    return(a.doc.time-b.doc.time)
}

function getLastNDays(doc_list,n){

    let limit = (new Date().getTime()) - n*24*60*60*1000;
    //console.log('limit',(new Date(limit).toLocaleString('es-CL')))
    let docs = [];
    for(let e of doc_list){
        if(e.doc.time > limit){
            docs.push(e);
        }
    }

    return docs;
}

io.on('connection', function(socket){
    console.log("connection")

    socket.on('db_connect',function(){
        db_check(function(check){
            if(check){
                console.log('connected to database');

                var db_changes = global.db.follow({since:"now"});
                db_changes.on('change',function(change){
                    //console.log('db change ',change.id,change.id.indexOf('measure'));
                    if(change.id.indexOf('measure')==-1){
                        socket.emit('db_changes',{change:change});
                    } else {
                        global.db.get(change.id, function(error,result){
                            if(!error){
                                socket.emit('db_changes',{change:change,node_id:result.node.node_id});
                            }
                        })
                    }
                })
                db_changes.follow();

                socket.emit('db_connection_resolve',{connection:true, error: 'none'});
            } else {
                console.log('no database connection');
                socket.emit('db_connection_resolve',{connection:false, error: 'no_db_connection'});
            }
        })
    })

    socket.on('get_all_reads_lvl', (days) => {
        global.db.view('nodes','all_docs',{include_docs:true},function(error,result){
        if(!error){
            let result_docs = getLastNDays(result.rows,days).sort(sortDocByTimestamp);
            let nodes = []
            let times = []
            for(let doc of result_docs){
                let doc_node_idx = nodes.findIndex(n => n.node_id==doc.doc.node.node_id);
                times.push(doc.doc.time);
                if(doc_node_idx==-1){
                    nodes.push({
                        node_id:doc.doc.node.node_id,
                        lvl_data:[
                            {
                                time:doc.doc.time,
                                value:doc.doc.data.lvl
                            }
                        ]
                    })
                } else {
                    nodes[doc_node_idx].lvl_data.push({
                        time:doc.doc.time,
                        value:doc.doc.data.lvl
                    })
                }
            }

            socket.emit('all_reads_lvl', {status:'ok',data:{nodes:nodes,times:times}})
         } else{
            socket.emit('all_reads_lvl',{status:'error',error:error,data:{}})
            }
        })
    })


    socket.on('get_nodes_info',() => {
        global.db.get('info',{include_docs:true},function(error,result){
            if(!error){
                socket.emit('nodes_info',{info:result})
            }
        })
    });

    socket.on('get_all_reads',(days) => {
        global.db.view('nodes','all_docs',{include_docs:true},function(error,result){
            if(!error){
                let result_docs = getLastNDays(result.rows,days).sort(sortDocByTimestamp);
                socket.emit('all_reads',{status:'ok',data:result_docs});
            } else {
                socket.emit('all_reads',{status:'error',error:error,data:[]})
            }
        })
    });

    socket.on('get_last_read',() => {
        global.db.view('nodes','all_docs',{include_docs:true},function(error,result){
            if(!error){
                let result_docs = result.rows.sort(sortDocByTimestamp);
                if(result_docs.length>0){
                    socket.emit('last_read',{status:'ok',data:{time:result_docs[0].doc.time}});
                } else {
                    socket.emit('last_read',{status:'no reads',data:{time:0}});
                }
                
            } else {
                socket.emit('last_read',{status:'error',error:error,data:{time:0}})
            }
        })
    })

    socket.on('get_read_count',() => {
        global.db.view('nodes','all_docs',{include_docs:true},function(error,result){
            if(!error){
                socket.emit('read_count',{status:'ok',data:{count:result.total_rows}});
                
            } else {
                socket.emit('read_count',{status:'error',error:error,data:{count:0}})
            }
        })
    });

    socket.on('get_node_data',data => {
        global.db.view('nodes','get_node',{key:data.node_id,include_docs:true},function(error,result){
            if(!error){
                let result_docs = getLastNDays(result.rows,data.days).sort(sortDocByTimestampReverse);
                //console.log({node_id:data.node_id,data:result_docs})
                socket.emit('node_data',{node_id:data.node_id,data:result_docs});
            } else {
                socket.emit('node_data',{status:'error',error:error,data:[]})
            }
        })
    })

    socket.on('get_node_last_read',data => {
        global.db.view('nodes','get_node',{key:data.node_id,include_docs:true},function(error,result){
            if(!error){
                if(result.rows.length==1){
                    socket.emit('node_last_read',{node_id:data.node_id,read:result.rows[0]})
                } else {
                    let last_read = result.rows.sort(sortDocByTimestamp);
                    socket.emit('node_last_read',{node_id:data.node_id,read:last_read[0]})
                }
            }
        })
    })

    socket.on('get_config',() => {
        global.db.get('config', {include_docs:true}, function(error,result){
            if(!error){
                socket.emit('config_response',{status:'ok',config:result})
            } else {
                console.log(error)
                socket.emit('config_response',{status:'error',error:error})
            }
        })
    })

    socket.on('save_config',data => {
        global.db.insert(data,function(error,result){
            if(!error){
                socket.emit('save_config_response',{status:'ok'})
            } else {
                socket.emit('save_config_response',{status:'error',error:error})
            }
        })
    })



});



	

console.info("Servidor listo, en puerto",PORT)