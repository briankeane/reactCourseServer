'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/environment');
var db        = {};

console.log('running index');
if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db);
}

var getFiles = function(path){
  var files = [];

  function getAllNestedFiles(path) {
    var files = [];
    fs.readdirSync(path).forEach(function(file){
        var subpath = path + '/' + file;
        if(fs.lstatSync(subpath).isDirectory()){
          files = files.concat(getAllNestedFiles(subpath));
        } else {
          files.push(path + '/' + file);
        }
    });
    return files;
  }

  var files = getAllNestedFiles(path);
  var filteredFiles = files.filter(function (file) {
    if((file.indexOf(".") !== 0) && (file.indexOf(".model.js") > 0)) {
      return true;
    }
    return false;
  });
  return filteredFiles; 
}

var files = getFiles(__dirname);

files.forEach(function (file) {
  var model = sequelize['import'](file);
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
