import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { Blacklist } from "../models/blacklist.model.js";
import { config } from "../config/config.js";

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers?.authorization?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const isBlacklisted = await Blacklist.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Session expired, please login again" });
        }

        const decoded = jwt.verify(token, config.jwt_secret);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        console.log("Error in verifyJWT middleware", error);
        return res.status(401).json({ message: "Invalid token" });
    }
};
