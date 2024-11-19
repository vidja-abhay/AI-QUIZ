const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
    gradeLevel: { type: String, required: true },
    subject: { type: String, required: true },
    questions: { type: Array, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Quiz", QuizSchema);
