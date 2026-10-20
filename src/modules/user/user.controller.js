import { Router } from "express";
import { logout, profile } from "./user.service.js";
import { authentication } from "../../middleware/index.js";
const router=Router()

router.get("/", authentication() ,(req,res,next)=>{
    
    const result  = profile(req.user)
    return res.status(200).json({message:"Profile" , result})
})
router.get("/logout", authentication() ,async (req,res,next)=>{
    await logout(req.user)
    return res.status(200).json({message:"logout successfully"})
})


export default router