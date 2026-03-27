import { config } from "../config/config.js";
import jwt from "jsonwebtoken";


const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email, username: user.username }, config.jwt_secret, { expiresIn: "1d" });
}


export { generateToken }
