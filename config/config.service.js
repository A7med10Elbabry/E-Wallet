import { resolve } from 'node:path'
import { config } from 'dotenv'
import e from 'express';

export const NODE_ENV = process.env.NODE_ENV

const envPath = {
    development: `.env.development`,
    production: `.env.production`,
}
console.log({ en: envPath[NODE_ENV] });


config({ path: resolve(`./config/${envPath[NODE_ENV]}`) })


export const port = process.env.PORT ?? 7000

export const DB_HOST = process.env.DB_HOST ?? '127.0.0.1'
export const DB_PORT = process.env.DB_PORT ?? 3306
export const DB_PASSWORD = process.env.DB_PASSWORD ?? ''
export const DB_USER = process.env.DB_USER ?? 'root'
export const DB_NAME = process.env.DB_NAME ?? 'test'
export const JWT_SECRET_ACCESS = process.env.JWT_SECRET_ACCESS 
export const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH
export const JWT_SYSTEM_ACCESS_SECRET = process.env.JWT_SYSTEM_ACCESS_SECRET
export const JWT_SYSTEM_REFRESH_SECRET = process.env.JWT_SYSTEM_REFRESH_SECRET
export const REDIS_URI = process.env.REDIS_URI 
export const ENCRYPTION_SECRET_KEY = Buffer.from(process.env.ENCRYPTION_SECRET_KEY)
export const MAIL_USER = process.env.MAIL_USER
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD
export const APP_NAME = process.env.APP_NAME
console.log({ REDIS_URI });




export const SALT_ROUND = parseInt(process.env.SALT_ROUND ?? '10')
console.log({SALT_ROUND});
