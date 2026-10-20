import { Router } from 'express'
import {  confirmEmail, login, resendConfirmEmail, signup } from './auth.service.js';
import { successResponse } from '../../comman/utiltes/response/success.response.js';
import * as validators from './auth.validation.js';
import { validation } from '../../middleware/index.js';
const router = Router(); 


router.post("/signup",validation(validators.signup) ,async (req, res, next) => {
    const result = await signup(req.body)
    successResponse({res, message: "Done signup", data: result, status: 201})
})


router.post("/confirmEmail",validation(validators.confirmEmail) ,async (req, res, next) => {
    const result = await confirmEmail(req.body)
    successResponse({res})
})

router.post("/login", async (req, res, next) => {
    
    const token = await login(req.body)
    successResponse({res, message: "Done login", data: token})
})

router.get("/resend-confirmEmail",validation(validators.resendConfirmEmail) ,async (req, res, next) => {
    const result = await resendConfirmEmail(req.body)
    successResponse({res})
})


export default router