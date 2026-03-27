import { User } from "../models/user.models.js"
import { generateToken } from "../utils/jwtToken.js"
import { Blacklist } from "../models/blacklist.model.js"
import jwt from "jsonwebtoken"
import { config } from "../config/config.js"


/**
 * @ route POST /api/v1/auth/register
 * @ description Register a new user expects username , email and password
 * @ access Public
 */
export async function register(req, res) {

    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please provide a valid email address" })
        }
        const alreadyUser = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (alreadyUser) {
            return res.status(400).json({ message: "User already exists" })
        }
        const user = await User.create({ username, email, password })
        const token = generateToken(user)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        })

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }

}




/**
 * @ route POST /api/v1/auth/login
 * @ description Login a user expects  email and password
 * @ access Public
 */

export async function login(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const isPasswordValid = await user.comparePassword(password)

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" })
        }

        const token = generateToken(user)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            },
            token

        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }

}




/**
 * @ route POST /api/v1/auth/logout
 * @ description Logout a user
 * @ access Private
 */
export async function logout(req, res) {
    try {
        const token = req.token;
        await Blacklist.create({ token });
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


/**
 * @ route GET /api/v1/auth/get-me
 * @ description Get the current logged in user
 * @ access Private
 */
export async function getMe(req, res) {
    try {
        return res.status(200).json({ user: req.user });
    } catch (error) {
        console.log("Error in get me controller", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}