const express = require('express');
const router = express.Router();

const getStudents = require('../controllers/students/getStudents');
const createStudent = require('../controllers/students/createStudent');
const updateStudent = require('../controllers/students/updateStudent');
const deleteStudent = require('../controllers/students/deleteStudent');

// call this controller whenever there is a matching route, but not a matching method!
const methodNotAllowed = (req, res, next) =>
  res.status(405).json('Method not allowed.');

router.route('/').get(getStudents).post(createStudent).all(methodNotAllowed);
router
  .route('/:id')
  .put(updateStudent)
  .delete(deleteStudent)
  .all(methodNotAllowed);

module.exports = router;
