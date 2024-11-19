const Quiz = require("../models/Quiz.js");
const QuizSubmission = require("../models/QuizSubmission.js");

const generateQuiz = async (req, res) => {
    const { gradeLevel, subject, questions } = req.body;
    const quiz = new Quiz({ gradeLevel, subject, questions });
    await quiz.save();
    res.status(201).json(quiz);
}

const submitQuiz = async (req, res) => {
    const { quizId, userId, answers } = req.body;

    // Fetch the quiz document by quizId to get gradeLevel, subject, and correct answers
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
    }

    console.log("Quiz questions:", quiz.questions);  // Log quiz questions
    console.log("User answers:", answers);  // Log user answers

    // Calculate the score based on correct answers
    let score = 0;
    for (let i = 0; i < quiz.questions.length; i++) {
        const question = quiz.questions[i];
        const correctOptionIndex = question.correctOption;  // Correct answer is an index
        const userAnswerIndex = answers[i];  // User's selected option is an index

        console.log(`Comparing User Answer Index: ${userAnswerIndex} with Correct Option Index: ${correctOptionIndex}`); // Log comparison

        // Check if the user's selected option index matches the correct answer index
        if (userAnswerIndex == correctOptionIndex) {
            score += 10;  // You can adjust the scoring system here, e.g., 10 points per correct answer
        }
    }

    console.log("Calculated score:", score);  // Log the final score

    try {
        // Check if the user has already submitted this quiz
        let submission = await QuizSubmission.findOne({ quizId, userId });
        
        if (submission) {
            // If the submission already exists, update the score and increment the attemptNumber
            submission.score = score;
            submission.attemptNumber += 1;  // Increment the attempt number
            await submission.save();  // Save the updated submission
            res.status(200).json({ submission });
        } else {
            // If no submission exists, create a new one
            submission = new QuizSubmission({
                quizId,
                userId,
                answers,
                score,
                gradeLevel: quiz.gradeLevel,  // Add gradeLevel from Quiz
                subject: quiz.subject,        // Add subject from Quiz
                attemptNumber: 1              // First attempt
            });
            await submission.save();
            res.status(200).json({ submission });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// const historyQuiz = async (req, res) => {
//     const { userId } = req;

//     console.log(userId);
//     const history = await QuizSubmission.find({ userId : userId._id });
//     res.status(200).json(history);
// }

const historyQuiz = async (req, res) => {
    console.log('Authenticated User:', req.user);  // Log the user object to see if it is set correctly

    // Check if the user object exists
    if (!req.user) {
        return res.status(401).json({ error: 'User not found in the request' });
    }

    // Use the user's _id to fetch quiz submissions
    const history = await QuizSubmission.find({ userId: req.user._id });
    res.status(200).json(history);
};

const historyQuizByGrade = async (req, res) => {
    const { gradeLevel } = req.query;
    try {
        const submissions = await QuizSubmission.find({
            gradeLevel,
            userId: req.user._id  // Filter only by logged-in user
        });
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const historyQuizBySubject = async (req, res) => {
    const { subject } = req.query;
    try {
        const submissions = await QuizSubmission.find({
            subject,
            userId: req.user._id  // Filter only by logged-in user
        });
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const historyQuizByMarks = async (req, res) => {
    const { minMarks, maxMarks } = req.query;
    try {
        const submissions = await QuizSubmission.find({
            score: { $gte: minMarks, $lte: maxMarks },
            userId: req.user._id  // Filter only by logged-in user
        });
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const historyQuizByDate = async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
        const submissions = await QuizSubmission.find({
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
            userId: req.user._id  // Filter only by logged-in user
        });
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {generateQuiz, submitQuiz, historyQuiz, historyQuizByGrade, historyQuizBySubject, historyQuizByMarks, historyQuizByDate};