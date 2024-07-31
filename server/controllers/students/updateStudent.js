const Student = require('../../db/mongo-models/Student');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    const id = req?.params?.id;
    if (!req.body) throw new Error('Body must be in request.');
    if (!id) throw new Error('ID be in params.');

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true },
    );

    if (!updatedStudent) {
      return res.status(400).json({
        error: 'Having trouble updating student new information.',
        success: false,
      });
    }

    res.status(200).json({ data: updatedStudent, success: true });
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      error: `Failed to update student information.`,
      errorMessage: err?.message,
      success: false,
    });
  }
};
