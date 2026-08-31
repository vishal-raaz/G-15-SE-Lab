const Question = require('../models/Question');

/**
 * Question Service — Single Responsibility: Only handles question CRUD operations
 */

const saveQuestion = async (questionData, userId) => {
  const question = new Question({ ...questionData, createdBy: userId });
  return await question.save();
};

const getQuestions = async (userId) => {
  return await Question.find({ createdBy: userId }).sort({ createdAt: -1 });
};

const deleteQuestion = async (questionId, userId) => {
  return await Question.findOneAndDelete({ _id: questionId, createdBy: userId });
};

const getQuestionCount = async (userId) => {
  return await Question.countDocuments({ createdBy: userId });
};

const getAIQuestionCount = async (userId) => {
  return await Question.countDocuments({ createdBy: userId, isAIGenerated: true });
};

module.exports = {
  saveQuestion,
  getQuestions,
  deleteQuestion,
  getQuestionCount,
  getAIQuestionCount
};
