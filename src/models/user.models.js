import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import InterviewReport from "./interviewreport.model.js";




const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, { timestamps: true })

userSchema.pre("save", async function () {
    // If the password field hasn't been modified, skip hashing to prevent re-hashing
    if (!this.isModified("password")) return;

    // Mathematically encrypt the user's password using the robust bcrypt library
    this.password = await bcrypt.hash(this.password, 10);
    // No need to call next() — Mongoose awaits the async function automatically
});


userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// Cascade delete: remove all reports when a user is deleted via findOneAndDelete
userSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await InterviewReport.deleteMany({ user: doc._id });
        console.log(`🗑️  Deleted all reports for user ${doc._id}`);
    }
});

// Cascade delete: remove all reports when a user is deleted via deleteOne
userSchema.post("deleteOne", { document: true, query: false }, async function (doc) {
    if (doc) {
        await InterviewReport.deleteMany({ user: doc._id });
        console.log(`🗑️  Deleted all reports for user ${doc._id}`);
    }
});

export const User = mongoose.model("User", userSchema)
