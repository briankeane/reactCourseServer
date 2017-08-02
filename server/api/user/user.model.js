'use strict';

const crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {
    setterMethods: {
      email (value) {
        this.setDataValue('email', value.toLowerCase());
      }
    },
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    indexes: [
    {
      unique: true,
      fields: ['email']
    }]
  });

  // instance methodss
  User.prototype.setPassword = function (value) {
    const salt = this.makeSalt();
    const hashedPassword = this.encryptPassword(value, salt);
    this.setDataValue('password', hashedPassword);
    this.setDataValue('salt', salt);
  };

  User.prototype.makeSalt = function () {
    return crypto.randomBytes(16).toString('base64');
  };

  User.prototype.encryptPassword = function(password, salt) {
    if (!password || !salt) return '';
    var salt = new Buffer(salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64');
  };

  User.prototype.authenticate = function(plainText) {
    return this.encryptPassword(plainText, this.salt) === this.password;
  };

  return User;
};