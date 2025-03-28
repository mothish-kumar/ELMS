import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ error: "No authorization header found" });
        }

        const token = authHeader.split(" ")[1];  
        
        if (!token) {
            return res.status(401).json({ error: "No token found" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
                return res.status(400).json({ error: "Invalid user ID format in token" });
            }

            req.userId = new mongoose.Types.ObjectId(decoded.id);
            req.role = decoded.role;

            next();
        } catch (jwtError) {
            return res.status(401).json({ error: "Invalid token" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Authentication failed" });
    }
};
