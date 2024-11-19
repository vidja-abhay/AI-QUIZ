const mongoose = require("mongoose");

const QuizSubmissionSchema = new mongoose.Schema({
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answers: { type: Array, required: true },
    score: { type: Number, required: true },
    attemptNumber: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
    gradeLevel: { type: String },
    subject: { type: String }
});

module.exports = mongoose.model("QuizSubmission", QuizSubmissionSchema);
