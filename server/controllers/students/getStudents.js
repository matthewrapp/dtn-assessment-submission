const Student = require('../../db/mongo-models/Student');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    const query = req?.query;
    const pageNum = +query?.pageNum;
    const limit = +query?.limit;
    const skip = (pageNum - 1) * limit;
    const direction = query?.direction;
    const column = query?.column;
    const filter = query?.filter;

    const students = await Student.aggregate([
      ...(filter === 'age' ? [{ $match: { age: { $gt: 20 } } }] : []),
      {
        $addFields: {
          ...(column === 'fullName' && {
            fullName: {
              $concat: [
                { $toLower: '$firstName' },
                ' ',
                { $toLower: '$lastName' },
              ],
            },
          }),
        },
      },
      { $sort: { fullName: direction === 'ASC' ? 1 : -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const filterCondition = filter === 'age' ? { age: { $gt: 20 } } : {};
    const totalCount = await Student.countDocuments(filterCondition);
    res.status(200).json({ data: { students, totalCount }, success: true });
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      error: `Failed to get all students.`,
      errorMessage: err?.message,
      success: false,
    });
  }
};
