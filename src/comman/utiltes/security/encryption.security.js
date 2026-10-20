import crypto from 'crypto'
import { ENCRYPTION_SECRET_KEY } from '../../../../config/config.service.js';

const IV_LENGTH = 16;


export const encrypt = async (text)=>{
    console.log(ENCRYPTION_SECRET_KEY.toString('hex'));
    const iv = crypto.randomBytes(IV_LENGTH);


    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_SECRET_KEY, iv)

    let encryption_data = cipher.update(text, 'utf-8', 'hex')
    encryption_data = cipher.final('hex')
    
    return `${iv.toString('hex')}:${encryption_data}`
} 

export const decrypt = async (encrypted_data)=>{
    const [iv, encryptedText] = encrypted_data.split(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_SECRET_KEY, Buffer.from(iv, 'hex'))
    let decrypted_data = decipher.update(encryptedText, 'hex', 'utf-8')
    decrypted_data += decipher.final('utf-8')
    return decrypted_data
} 