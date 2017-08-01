'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/environment');
var db        = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db);
}

var getFiles = function(path){
  var files = [];
  fs.readdirSync(path).forEach(function(file){
      var subpath = path + '/' + file;
      if(fs.lstatSync(subpath).isDirectory()){
          getFiles(subpath, files);
      } else {
          files.push(path + '/' + file);
      }
  });
  files = files.filter(function (file) {
    if((file.indexOf(".") !== 0) && (file.indexOf(".model.js") > 0)) {
      console.log("debug", "Discovered path: " + path);
      return true;
    }
  });
  return files; 
}

var files = getFiles(__dirname);
files.forEach(function (file) {
  var model = sequelize['import'](path.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
