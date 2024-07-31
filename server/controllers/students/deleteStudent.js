const Student = require('../../db/mongo-models/Student');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    const id = req?.params?.id;
    if (!id) throw new Error('ID be in params.');
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res
        .status(404)
        .json({ error: `Student not found.`, success: false });
    }
    res
      .status(200)
      .json({ message: `Student successfully deleted.`, success: true });
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      error: `Failed to delete student.`,
      errorMessage: err?.message,
      success: false,
    });
  }
};
