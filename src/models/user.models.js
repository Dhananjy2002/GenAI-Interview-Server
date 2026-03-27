import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";




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


export const User = mongoose.model("User", userSchema)
