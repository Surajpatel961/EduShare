import User from "../models/user.js";

const roleMiddleware = (...roles) => {

     return async (req , res , next) => {
    
      try {
        
        if(!roles.includes(req.user.role)){
           return res.status(403).json({
                success: false,
                message: "Only faculty can upload notes"
            }); 
        }

        const user = await User.findById(req.user.id);

        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }
        
        if (user.role !== "faculty") {
          return res.status(403).json({
            success: false,
            message: "Faculty access only",
          });
        }
        
        if (!user.isVerified) {
          return res.status(403).json({
            success: false,
            message: "Faculty approval pending",
          });
        }

        if (user.approvalStatus !== "approved") {
          return res.status(403).json({
            success: false,
            message: "Faculty approval pending or rejected",
          });
        }
        next()
    }
     catch (error) {
     res.status(500).json({
        success:false,
        message:"Internal server error"
     })
   }
  }
}

export default roleMiddleware;