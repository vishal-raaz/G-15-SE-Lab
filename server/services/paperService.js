const Paper = require('../models/Paper');

/**
 * Paper Service — Single Responsibility: Only handles paper CRUD operations
 */

const savePaper = async (paperData, userId) => {
  const paper = new Paper({ ...paperData, createdBy: userId });
  return await paper.save();
};

const getPapers = async (userId) => {
  return await Paper.find({ createdBy: userId }).sort({ createdAt: -1 });
};

const getPaperById = async (paperId, userId) => {
  return await Paper.findOne({ _id: paperId, createdBy: userId });
};

const getPaperCount = async (userId) => {
  return await Paper.countDocuments({ createdBy: userId });
};

module.exports = {
  savePaper,
  getPapers,
  getPaperById,
  getPaperCount
};
