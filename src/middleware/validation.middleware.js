import { BadRequestException } from "../comman/utiltes/response/index.js";


export const validation = (schema) => {
    return async (req, res, next) => {
        const errors  = []
        for (const key of Object.keys(schema)|| []) {
            const validationResult = schema[key].validate(req[key], {abortEarly: false})
            if (validationResult.error){
                errors.push({key, details: validationResult.error.details.map(ele =>{
                    return {path: ele.path, message: ele.message}
                })})
            }
        }
        if (errors.length) {
            throw BadRequestException({massage:'Validation Error', extra:errors})
        }
        next();
    };
}