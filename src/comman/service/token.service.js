import jwt from 'jsonwebtoken';
import { JWT_SECRET_ACCESS, JWT_SYSTEM_ACCESS_SECRET } from '../../../config/config.service.js';
import { BadRequestException, UnauthorizedException } from '../utiltes/response/error.response.js';
import { userModel } from '../../DB/index.js';


export const createLoginCredentials = async (user) => {
    const payload = {
        userId: user.ID,
        email: user.email,
        role: user.role,
    }
    if (user.role === 'admin') {
    const token =  jwt.sign(payload, JWT_SYSTEM_ACCESS_SECRET, { expiresIn: 900 });
        return  {token}
    }
    const token =  jwt.sign(payload, JWT_SECRET_ACCESS, { expiresIn: 900 });
        return { token };
    }

export const verifyToken = async (token, secret) => {
    return jwt.verify(token, secret);
}

export const decodeToken = async (token) => {
    const decode = jwt.decode(token);
    console.log({decode});
    const secret = decode.role === 'admin'?  JWT_SYSTEM_ACCESS_SECRET : JWT_SECRET_ACCESS;
    const verified_data = await verifyToken(token, secret);
    if (!verified_data) {
        UnauthorizedException({message: 'Invalid token'})
    }
        const user = await userModel.findOne({where:{ID: decode.userId}});
        if (!user) {
            BadRequestException({message: 'Not Registered account'})
        }
        if (decode.iat < user.changeCredentialsTime?.getTime() / 1000) {
        throw BadRequestException({massage: 'Token is expired'})
            }
        return {decode, user}
}