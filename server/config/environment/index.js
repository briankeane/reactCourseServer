'use strict';

const path = require('path');

var commonConfig = {
  env: process.env.NODE_ENV,

  // root path of the server
  root: path.normalize(__dirname + '/../../..'),

  // server port:
  port: process.env.PORT || 9000
};

// grab file of secret stuff
var localEnv;
try {
  localEnv = require('../local.env');
} catch (err) {
  localEnv = {};
}

function getEnvObject() {
  var envObject = {};
  if (process.env.NODE_ENV) {
    envObject = require(`./${process.env.NODE_ENV}.js`);
  }
  return envObject;
}

var outsideConfig = Object.assign({},
  localEnv,
  getEnvObject()
  );

module.exports = Object.assign(commonConfig, outsideConfig);