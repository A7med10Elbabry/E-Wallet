import { Op } from "sequelize"
import { userModel } from "../../DB/index.js"
import {randomUUID} from "node:crypto"
import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from "../../comman/utiltes/response/error.response.js"
import { createLoginCredentials } from "../../comman/service/token.service.js"
import { compareHash, generateHash, } from "../../comman/utiltes/security/index.js"
import { sendEmail } from "../../comman/utiltes/email/sendEmail.js"
import { sendEmailTemplate } from "../../comman/utiltes/email/templet.email.js"
import { createOtp } from "../../comman/utiltes/security/otp.js"
import { confirmEmailKey, del, get, set } from "../../comman/service/redis.service.js"





export const signup = async ({email, password, phone, firstName, lastName}) => {

const checkUserExists = await userModel.findOne({ where: {
    [Op.or]:[{ email:email }, { phone:phone}] 
}})
    if (checkUserExists) {
       throw ConflictException({massage:"user already exists"})
    }
   const user =  await userModel.create(
        { ID: randomUUID() ,email, password, phone, firstName, lastName }
    )
    const otp =  createOtp()
   
    await set({key:confirmEmailKey({email}), value: await generateHash(otp), ttl: 60*3})


    Promise.allSettled([
        sendEmail({
        to: email,
        subject: "Confirm your email",
        html: sendEmailTemplate({title: "Confirm your email", email, message: `Your OTP is ${otp}`})
    })
    ])

  
    return user;
}



export const login = async ({email, password}) => {

const user = await userModel.findOne({ where: { email:email }})
    if (!user) {
        throw NotFoundException({massage:"user not found"})
    }
    if(user.confirmEmail === null){
        throw UnauthorizedException({massage:"Please confirm your email"})
    }
    if (!await compareHash(password, user.password) ) {
        throw UnauthorizedException({massage:"invalid Email or password"})
    }
    return await createLoginCredentials(user);
}


export const confirmEmail = async ({email, otp}) => {
    const user = await userModel.findOne({ where: { email:email }})
    if (!user) {
        throw NotFoundException({massage:"user not found"})
    }
    if(!user.confirmEmail === null){
        throw UnauthorizedException({massage:"the account is already confirmed"})
    }
    const hashedOtp = await get({key:confirmEmailKey({email})})
    if (!hashedOtp) {
        throw BadRequestException({massage: "invalid otp"})
    }
    if (! await compareHash(otp, hashedOtp)) {
        throw BadRequestException({massage: "invalid otp"})
    }
    await del({key:confirmEmailKey({email})})
    await userModel.update({ confirmEmail: Date.now() }, { where: { email:email }})
}

export const resendConfirmEmail = async ({email}) => {
    const user = await userModel.findOne({ where: { email:email }})
    if (!user) {
        throw NotFoundException({massage:"user not found"})
    }
    if(!user.confirmEmail === null){
        throw UnauthorizedException({massage:"the account is already confirmed"})
    }
    if (await get({key: confirmEmailKey({email})})) {
        throw BadRequestException({massage: "otp code still valid"})
    }

    const otp = createOtp()

    await set({key:confirmEmailKey({email}), value: await generateHash(otp), ttl: 60*3})
    sendEmail({
        to: email,
        subject: "Confirm your email",
        html: sendEmailTemplate({title: "Confirm your email", email, message: `Your OTP is ${otp}`})
    })

    
}

