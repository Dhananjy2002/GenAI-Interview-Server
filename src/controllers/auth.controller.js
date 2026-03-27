import { User } from "../models/user.models.js"
import { generateToken } from "../utils/jwtToken.js"
import { Blacklist } from "../models/blacklist.model.js"
import jwt from "jsonwebtoken"
import { config } from "../config/config.js"
import { sendEmail } from "../services/email.service.js"
import crypto from "crypto"


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

        // SEND WELCOME EMAIL
        try {
            await sendEmail(
                user.email,
                "Welcome to Interview Master!",
                `Hi ${user.username}, welcome to Interview Master! We are excited to have you on board.`,
                `<h1>Welcome, ${user.username}!</h1><p>We're thrilled to have you here at Interview Master.</p>`
            );
        } catch (mailError) {
             console.error("Failed to send welcome email:", mailError.message);
        }

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

/**
 * @ route POST /api/v1/auth/forgot-password
 * @ description Send a password reset email
 * @ access Public
 */
export async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate a random reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
        await user.save();

        const resetUrl = `${config.frontend_url}/reset-password/${resetToken}`;

        try {
            await sendEmail(
                user.email,
                "Password Reset Request",
                `You requested a password reset. Please go to this link to reset your password: ${resetUrl}`,
                `<p>You requested a password reset.</p><p>Click <a href="${resetUrl}">here</a> to reset your password.</p><p>This link is valid for 15 minutes.</p>`
            );
            return res.status(200).json({ message: "Password reset email sent" });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            return res.status(500).json({ message: "Email could not be sent" });
        }

    } catch (error) {
        console.log("Forgot password error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @ route POST /api/v1/auth/reset-password/:token
 * @ description Reset password using the emailed token
 * @ access Public
 */
export async function resetPassword(req, res) {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) return res.status(400).json({ message: "New password is required" });

        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.log("Reset password error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}