import { redisClient } from "../../DB/index.js";
import { EMAIL_ENUM } from "../utiltes/enums/index.js";


export const baseKey = ({email, subject}={})=>{
    return `${email}:${subject}`
}
 
export const confirmEmailKey = ({email}={})=>{
    return baseKey({email, subject:EMAIL_ENUM.CONFIRM_EMAIL})
}

export const get = async({key}={})=>{
    try {
        return await redisClient.get(key)
    } catch (error) {
        console.log(`Redis get Error: ${error}`);
    }
}

export const set = async ({key, value, ttl}={})=>{
    try {
        if (ttl) {
            return await redisClient.set(key, value, {EX: ttl})
        }
        return await redisClient.set(key, value)
    } catch (error) {
        console.log(`Redis set Error: ${error}`);
    }
}

export const del = async ({key}={})=>{
    try {
        return await redisClient.del(key)
    } catch (error) {
        console.log(`Redis del Error: ${error}`);
    }
}
