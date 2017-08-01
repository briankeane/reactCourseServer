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
      },
      password (value) {
        const salt = this.makeSalt();
        this.setDataValue('salt', salt);
        this.setDataValue('password', this.encryptPassword(value));
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
    }],
    instanceMethods: {
      makeSalt: function () {
        return crypto.randomBytes(16).toString('base64');
      },
      authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
      },
      encryptPassword: function(password) {
        if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64');
      }
    }
  });

  return User;
};

