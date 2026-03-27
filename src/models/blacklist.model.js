import mongoose from "mongoose";


const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        index: true

    }
}, { timestamps: true })


export const Blacklist = mongoose.model("Blacklist", blacklistSchema)