'use strict';

const express     =   require('express');
const config      =   require('./config/environment');
const http        =   require('http');
const Sequelize   =   require('sequelize');

// if connecting to database, do it here.
// Example: 
//    const mongoose    =   require('mongoose');
//    mongoose.Promise = Q.Promise;
//    mongoose.connect(config.mongo.uri, config.mongo.options);
//    mongoose.connection.on('error', function(err) {
//      console.error(`MongoDB connection error: ${err}`);
//      process.exit(-1); // eslint-disable-line no-process-exit
//    });

// setup server


var app = express();
var server = http.createServer(app);

// add all the middleware to the app
require('./config/express').default(app);

// require routes
require('./api/routes').default(app);

function startServer() {
  app.server = server.listen(config.port, config.ip, function () {
    console.log(`Express server listening on ${config.port}, in ${app.get('env')} mode`);
  });
}

setImmediate(startServer);

// expose app
exports = module.exports = app;