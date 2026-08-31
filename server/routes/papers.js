const express = require('express');
const auth = require('../middleware/auth');
const { savePaper, getPapers, getPaperById, getPaperCount } = require('../services/paperService');
const { getQuestionCount, getAIQuestionCount } = require('../services/questionService');

const router = express.Router();

// GET /api/papers/stats — Dashboard statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const totalQuestions = await getQuestionCount(req.userId);
    const totalPapers = await getPaperCount(req.userId);
    const aiQuestions = await getAIQuestionCount(req.userId);
    res.json({ totalQuestions, totalPapers, aiQuestions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
});

// POST /api/papers — Save a question paper
router.post('/', auth, async (req, res) => {
  try {
    const paper = await savePaper(req.body, req.userId);
    res.status(201).json(paper);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save paper', error: error.message });
  }
});

// GET /api/papers — Get all papers
router.get('/', auth, async (req, res) => {
  try {
    const papers = await getPapers(req.userId);
    res.json(papers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch papers', error: error.message });
  }
});

// GET /api/papers/:id — Get paper by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const paper = await getPaperById(req.params.id, req.userId);
    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }
    res.json(paper);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch paper', error: error.message });
  }
});

module.exports = router;
