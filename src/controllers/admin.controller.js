import mongoose from "mongoose";
import User from "../models/user.js";
export const getPendingFaculty = async (req, res) => {
  try {
    const faculties = await User.find({
      role: "faculty",
      isVerified: false,
      approvalStatus:"pending"
    }).select("-password");

    return res.status(200).json({
      success: true,
      data: faculties,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const approveFaculty = async (req, res) => {
  try {
    const { id } = req.params;

   if(!mongoose.Types.ObjectId.isValid(id)) {
     return res.status(400).json({
        success: false,
        message: "Invalid faculty ID",
      });
   }

    const faculty = await User.findOneAndUpdate(
      {
        _id: id,
        role: "faculty",
        approvalStatus:"pending"
      },
      {
        isVerified: true,
        approvalStatus:"approved"
      },
      {
        new: true,
      }
    ).select("-password");

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Faculty approved successfully",
      data: faculty,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const rejectFaculty = async (req, res) => {

    try {
        const {id} = req.params;

    const faculty = await User.findOneAndUpdate(
        {_id:id, role: "faculty",isVerified:false,approvalStatus:"pending"},
        {isVerified:false,approvalStatus:"rejected"},
        {new:true}
    )

    if(faculty === null) {
        return res.status(404).json({
               success:false,
               message:"faculty not found"
        })
    }

    res.status(200).json({
        success:true,
        message:"faculty is rejected",
        data:faculty

    })
    } catch (error) {
        res.status(500).json({
            message:error.message,
            success:false
        })
    }

}