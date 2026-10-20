import { decodeToken } from "../comman/service/token.service.js"
import { UnauthorizedException } from "../comman/utiltes/response/error.response.js"



export const authentication =  () => {
    return async(req, res, next) => {
        console.log({token: req.headers.authorization});
        if (!req.headers.authorization) {
            UnauthorizedException({massage: 'Token is required'})
        }
        const {decode, user} = await decodeToken(req.headers.authorization)
        req.user = user
        req.decode = decode
        next()
    }
}