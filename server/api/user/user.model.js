'use strict';

const bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.String
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
    }],
    instanceMethods: {
      emailAndPassword: function () {
        return `${this.email} ${this.password}`;
      }
    }
  });

  var hashPasswordHook = function(instance, done) {
    if (!instance.changed('password')) return done();
    bcrypt.hash(instance.get('password'), 10, function (err, hash) {
      if (err) return done(err);
      instance.set('password', hash);
      done();
    });
  };

  User.beforeCreate(hashPasswordHook);
  User.beforeUpdate(hashPasswordHook);

  return User;
};

