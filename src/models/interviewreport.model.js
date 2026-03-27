import mongoose from "mongoose";




const technicalQuestionsSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"],

    }
}, {
    _id: false
})


const skillsGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"]
    },
    severity: {
        type: String,
        enum: ["high", "medium", "low"],
        required: [true, "Severity is required"],
    }
}, {
    _id: false
})

const behavioralQuestionsSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"],

    }
}, {
    _id: false
})




const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required: [true, "Focus is required"]
    },
    tasks: [{
        type: String,
        required: [true, "Task is required"]
    }]
}, {
    _id: false
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    resume: {
        type: String,

    },
    selfDescription: {
        type: String,


    },
    matchScore: {
        type: Number,
        required: [true, "Match score is required"],
        min: [0, "Match score must be between 0 and 100"],
        max: [100, "Match score must be between 0 and 100"]
    },
    technicalQuestions: [technicalQuestionsSchema],
    behavioralQuestions: [behavioralQuestionsSchema],
    skillGaps: [skillsGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }




}, {
    timestamps: true
})


const InterviewReport = mongoose.model("InterviewReport", interviewReportSchema);

export default InterviewReport;



