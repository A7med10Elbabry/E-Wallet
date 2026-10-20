import { NODE_ENV } from "../../config/config.service.js"


export const globalErrorHandler = (error, req, res, next) => {
    const status = error.cause?.status ?? 500
            return res.status(status).json({
                error_message:
                    status == 500 ? 'something went wrong' : error.message ?? 'something went wrong',
                    extra: error.cause?.extra ?? undefined,
                stack: NODE_ENV == "development" ? error.stack : undefined
            })
}