const express = require("express");
const Quiz = require("../models/Quiz.js");
const QuizSubmission = require("../models/QuizSubmission.js");
const {generateQuiz, submitQuiz, historyQuiz, historyQuizByGrade, historyQuizBySubject, historyQuizByMarks, historyQuizByDate} = require("../controllers/QuizController.js");
const {authenticateUser} = require("../middleware/authenticator.js");

const router = express.Router();

router.post('/generate', generateQuiz);
router.post('/submit', submitQuiz);
router.get('/history',authenticateUser, historyQuiz);

// Filter Routes
router.get('/history/grade-level', authenticateUser, historyQuizByGrade);
router.get('/history/subject', authenticateUser, historyQuizBySubject);
router.get('/history/marks', authenticateUser, historyQuizByMarks);
router.get('/history/completed-date', authenticateUser, historyQuizByDate);

module.exports = router;