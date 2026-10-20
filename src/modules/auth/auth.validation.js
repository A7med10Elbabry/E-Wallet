import joi from "joi";
import { genralValidationFields } from "../../comman/utiltes/security/index.js";


export const login = {
    body: joi.object().keys({
        email:genralValidationFields.email.required(),
        password:genralValidationFields.password.required()
    }).required()
}


export const signup = {
    body: login.body.append().keys({
        phone:genralValidationFields.phone.required(),
        firstName:genralValidationFields.firstName.required(),
        lastName:genralValidationFields.lastName.required(),
        confirmPassword:genralValidationFields.confirmPassword.required()
}).required()
    }

export const confirmEmail = {
    body: joi.object().keys({
        email:genralValidationFields.email.required(),
        otp:genralValidationFields.otp.required()
    }).required()
}


export const resendConfirmEmail = {
    body: joi.object().keys({
        email:genralValidationFields.email.required(),
    }).required()
}

