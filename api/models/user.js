'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    class User extends Model {}
    User.init({
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A first name is required'
          },
          notEmpty: {
            msg: 'Please provide a last name'
          }
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A last name is required'
          },
          notEmpty: {
            msg: 'Please provide a last name'
          }
        }
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'The email you entered already exists'
        },
        validate: {
          notNull: {
            msg: 'An email is required'
          },
          isEmail: {
            msg: 'Please provide a valid email'
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val) {
            const hashedPassword = bcrypt.hashSync(val, 10);
            this.setDataValue('password', hashedPassword);
        },
        validate: {
          notNull: {
            msg: 'Must enter a password'
          }
        }
      }
    }, { sequelize });

    User.associate = (models) => {
        User.hasMany(models.Course, {
          as: 'owner', // alias
          foreignKey: {
            fieldName: 'userId',
            allowNull: false,
          },
        });
      };
  
    return User;
  };
