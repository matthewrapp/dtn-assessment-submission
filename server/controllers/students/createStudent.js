const { default: mongoose } = require('mongoose');
const Student = require('../../db/mongo-models/Student');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    if (!req.body) throw new Error('Body must be in request.');
    let newStudent = new Student(req.body);
    newStudent._id = new mongoose.Types.ObjectId();
    newStudent = await newStudent.save();
    if (!newStudent) {
      return res
        .status(400)
        .json({ error: 'Having trouble saving new student.', success: false });
    }

    newStudent._id = newStudent?._id?.toString();
    res.status(200).json({
      data: newStudent,
      success: true,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      error: `Failed to create new student.`,
      errorMessage: err?.message,
      success: false,
    });
  }
};
