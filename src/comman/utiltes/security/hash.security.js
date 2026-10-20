import bcrypt from 'bcrypt';
import { SALT_ROUND } from '../../../../config/config.service.js';




export const generateHash = async (text) => {
    return await bcrypt.hash(text, SALT_ROUND)
}


export const compareHash = async (text, hash) => {
    return await bcrypt.compare(text, hash)
}