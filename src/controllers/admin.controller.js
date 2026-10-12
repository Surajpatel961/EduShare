import User from "../models/user.js";
export const getPendingFaculty = async (req, res) => {
  try {
    const faculties = await User.find({
      role: "faculty",
      isVerified: false,
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

    const faculty = await User.findOneAndUpdate(
      {
        _id: id,
        role: "faculty",
      },
      {
        isVerified: true,
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