'use strict';

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    hooks: {
      beforeCreate: function(user, options, callback) {  //hook runs a function with 3 params - in this case, we don't have any options
        if (user.password) {  //check to confirm user actually created a password
          bcrypt.hash(user.password, 10, function(err, hash) {  //encode the password with bcrypt, callback passes 2 params - error(if any), and then the actual hash if it created
            if (err) return callback(err);   //if there's an error in creating the hash...return stops the code here.
            user.password = hash;  //...otherwise assigns the hash as the password
            callback(null, user);  //callback is just a function Sequelize requires when we're done with hook
          });
        } else {
          callback(null, user);
        }
      }
    }
  });
  return user;
};