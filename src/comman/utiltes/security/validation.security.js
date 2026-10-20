import joi from "joi"


export const genralValidationFields = {
    email: joi.string().email(),
    password: joi.string().min(8),
    phone: joi.string().pattern(/^(?:\+20|0020|0)1[0125][0-9]{8}$/),
    firstName: joi.string(),
    lastName: joi.string(),
    confirmPassword: joi.string().valid(joi.ref('password')),
    otp: joi.string().length(6).pattern(/^[0-9]+$/)
}