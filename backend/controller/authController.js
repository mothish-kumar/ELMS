import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../Schema/UserSchema.js';
import Course from '../Schema/CourseSchema.js';



export const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({error: "Please fill all the fields"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "User does not exist"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({error: "Invalid Credentials"});
        }
        const token = jwt.sign({id: user._id,role:user.role}, process.env.JWT_SECRET, {expiresIn: "1h"});
        res.status(200).json({message: "Login Successful",role:user.role,token,userName:user.name,userId:user._id});
    }catch(error){
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const register = async (req, res) => {
    try{
        const {name, email, password,role} = req.body;
        if(!name || !email || !password || !role){
            return res.status(400).json({error: "Please fill all the fields"});
        }
        const isEmailExist = await User.findOne({email});
        if(isEmailExist) return res.status(400).json({error: "Email already exists"});

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.JWT_SALT));
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });
        await user.save();
        res.status(201).json({message: "User Registered Successfully"});
    }catch(error){
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const logout = async (req, res) => {
    try{
        res.status(200).json({message: "Logout Successful"});
    }catch(error){
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const getTotal = async(req,res)=>{
    try{
        const totalCourses = await Course.countDocuments();
        const totalStudents = await User.countDocuments({role:"student"});
        const totalInstructors = await User.countDocuments({role:"instructor"});
        res.status(200).json({totalCourses,totalStudents,totalInstructors});
    }catch(error){
        res.status(500).json({error: "Internal Server Error"});
    }
}

