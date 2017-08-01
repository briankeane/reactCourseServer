'use strict';

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    setterMethods: {
      email(value) {
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
  return User;
};

