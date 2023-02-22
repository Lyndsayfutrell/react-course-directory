'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    class Course extends Model {}
    Course.init({
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A title is required'
          },
          notEmpty: {
            msg: 'Please enter a valid title'
          }
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A description is required'
          },
          notEmpty: {
            msg: 'Please enter a description'
          }
        }
      },
      estimatedTime: {
        type: DataTypes.STRING,
        },
      materialsNeeded: {
        type: DataTypes.STRING,  
    
      }
    }, { sequelize });

    Course.associate = (models) => {
        Course.belongsTo(models.User, {
          as: 'owner', // alias
          foreignKey: {
            fieldName: 'userId',
            allowNull: false,
          },
        });
      };
  
    return Course;
  };
