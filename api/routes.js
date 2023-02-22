'use strict';

const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');
const { User, Course } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');
const auth = require('basic-auth');
var createError = require('http-errors');

const router = express.Router();

// Gets and authenticates user
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    
    res.json({
      "Username": user.emailAddress,
      "Name": `${user.firstName} ${user.lastName}`,
      "User ID": user.id
    });
  }));

  // Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.redirect(201, "/");
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }
  }));

//Get all courses
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']},
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['firstName', 'lastName', 'emailAddress']
          },
        ],
      });
    res.json(courses);
}));

//Get all courses
router.get('/courses/:id', asyncHandler(async (req, res, next) => {
    const course = await Course.findByPk(req.params.id, {
        attributes: {exclude: ['createdAt', 'updatedAt']},
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['firstName', 'lastName', 'emailAddress']
          },
        ],
      });
      if(course) {
        res.json(course);
      } else {
        next(createError(404));
      }
    }));

router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.redirect(201, `/courses/${course.id}`);
      } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
        } else {
          throw error;
        }
      }
}));

router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res, next) => {
    let course;
    try {
        course = await Course.findByPk(req.params.id);
        const username = auth(req).name;
        const user = await User.findOne({ where: {  emailAddress: username}});
        if(course) {
            if(course.userId === user.id) {
                await course.update(req.body);
                res.status(204);
                res.end();
            } else {
                res.status(401).json({ message: "Access Denied: User doesn't own the requested course" });
            }
        } else {
            next(createError(404));
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
        } else {
            throw error;
        }
    }

}));

router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res, next) => {
    let course;
    try {
        course = await Course.findByPk(req.params.id);
        const username = auth(req).name;
        const user = await User.findOne({ where: {  emailAddress: username}});
        if(course) {
            if(course.userId === user.id) {
                await course.destroy();
                res.status(204);
                res.end();
            } else {
                res.status(401).json({ message: "Access Denied: User doesn't own the requested course" });
            }
        } else {
            next(createError(404));
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
        } else {
            throw error;
        }
    }

}));

module.exports = router;