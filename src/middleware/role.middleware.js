import User from "../models/user";

const roleMiddleware = (...roles) => {
    
    return async (req , res , next) => {
        
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
        next()
    }
}

export default roleMiddleware;