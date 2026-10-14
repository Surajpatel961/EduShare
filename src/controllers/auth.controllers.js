import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

export const register = async (req , res) =>{

  try{
        
    const { name, email, password, role, semester, department} = req.body

    if(!name || !email || !password || !role){
            return res.status(400).json({
                success:false,
                message:"all fields are required"
        })
    }

    if(role !== "student" && role !== "faculty") {
        return res.status(403).json({
            success:false,
            message:"admin registeration not allowed"
        })
    }

    const userEmail = await User.findOne({email})

    if(userEmail){
        return res.status(409).json({
            success:false,
            message:"email already exist"
        })
    }

    const hashPassword = await bcrypt.hash(password , 10);

    const user = new User({
        name,
        email,
        password:hashPassword,
        role,
        semester,
        department,

        isVerified: role === "student" ? true : false,
        approvalStatus: role === "student" ? "approved" : "pending",
    })

    await user.save()

    const userObject = user.toObject();
    delete userObject.password

    return res.status(201).json({
        success:true,
        message: "User registered successfully",
        data:userObject
    })
  }catch(error){
    
    res.status(500).json({
        success:false,
        message:error.message
    })
  }
     
}

export const login = async (req , res) =>{
  
    try{
        const {email , password} = req.body

        const user = await User.findOne({email})

        if(!user) return res.status(409).json({
            success:false,
            message:"Invaild email or password"
        })

        const isPasswordCorrect = await bcrypt.compare(password , user.password)

        if(!isPasswordCorrect){

            return res.status(401).json({
                success:false,
                message:"Invaild email or password"
            })

        }

        const token = jwt.sign({
            
                id:user._id,
                role:user.role,

        }, process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRES_IN
        })

        console.log("Generated Token:", token);
        console.log("Verified Immediately:", jwt.verify(token, process.env.JWT_SECRET));

        return res.status(200).json({
           success: true,
           message: "Login successful",
           token,
           approvalStatus: user.approvalStatus
        });

    }catch(error){
        res.status(500).json({
            success:false,
           message : error.message
        })
       

    }
    
}