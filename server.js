#!/usr/bin/env node

var debug = require('debug')('my-application');
var app = require('./app');
var http = require('http');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

app.set('port', process.env.PORT || 3000);

if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
        cluster.fork();
    });

    cluster.on('disconnect', function(worker) {
        console.log('The worker #' + worker.id + ' has disconnected');
        cluster.fork();
    });
} else {
    // Workers can share any TCP connection
    // In this case its a HTTP server

    var server = http.createServer(app);
    var boot = function() {
        server.listen(app.get('port'), function() {
            // console.info('Express server listening on port ' + app.get('port'));
        });
    }
    var shutdown = function() {
        server.close();
    }
    if (require.main === module) {
        boot();
    } else {
        console.info('Running app as a module')
        exports.boot = boot;
        exports.shutdown = shutdown;
        exports.port = app.get('port');
    }
}