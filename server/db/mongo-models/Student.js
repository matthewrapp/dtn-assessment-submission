const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  age: {
    type: Number,
  },
  grade: {
    type: String,
  },
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
