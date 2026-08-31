const express = require('express');
const auth = require('../middleware/auth');
const { generateQuestions } = require('../services/aiService');
const { saveQuestion, getQuestions, deleteQuestion } = require('../services/questionService');

const router = express.Router();

// POST /api/questions/generate — Generate questions using AI
router.post('/generate', auth, async (req, res) => {
  try {
    const { subject, unit, topic, numberOfQuestions, marks, difficulty } = req.body;

    if (!subject || !topic || !numberOfQuestions || !marks || !difficulty) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const questions = await generateQuestions({
      subject,
      unit: unit || '',
      topic,
      numberOfQuestions: Number(numberOfQuestions),
      marks: Number(marks),
      difficulty
    });

    res.json({ questions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate questions', error: error.message });
  }
});

// POST /api/questions — Save a question to database
router.post('/', auth, async (req, res) => {
  try {
    const question = await saveQuestion(req.body, req.userId);
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save question', error: error.message });
  }
});

// GET /api/questions — Get all saved questions
router.get('/', auth, async (req, res) => {
  try {
    const questions = await getQuestions(req.userId);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch questions', error: error.message });
  }
});

// DELETE /api/questions/:id — Delete a question
router.delete('/:id', auth, async (req, res) => {
  try {
    await deleteQuestion(req.params.id, req.userId);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete question', error: error.message });
  }
});

module.exports = router;
