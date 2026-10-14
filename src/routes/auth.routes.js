import { register , login } from "../controllers/auth.controllers.js";
import express from "express"
import authMiddleware from "../middleware/auth.middleware.js";
import { approveFaculty,getPendingFaculty, rejectFaculty } from "../controllers/admin.controller.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/register" , register)

router.post("/login" , login)

router.get("/pending-faculty",authMiddleware,adminMiddleware, getPendingFaculty)

router.patch("/faculty/:id/approve", authMiddleware, adminMiddleware, approveFaculty)

router.patch("/faculty/:id/reject", authMiddleware, adminMiddleware, rejectFaculty)

router.get("/profile" ,authMiddleware , (req , res) =>{
    res.json({
        message:" welocme , this is protocted route",
        user:req.user
    })
})

export default router

