

export const ErrorException = ({massage = 'fail', status = 400, extra = undefined}={})=>{
    throw new Error(massage, {cause:{status,extra}})
}

export const ConflictException = ({massage = 'conflict', status = 409, extra = undefined}={})=>{
    return ErrorException({massage, status, extra})
}

export const NotFoundException = ({massage = 'not found', status = 404, extra = undefined}={})=>{
    return ErrorException({massage, status, extra})
}

export const UnauthorizedException = ({massage = 'unauthorized', status = 401, extra = undefined}={})=>{
    return ErrorException({massage, status, extra})
}

export const ForbiddenException = ({massage = 'forbidden', status = 403, extra = undefined}={})=>{
    return ErrorException({massage, status, extra})
}

export const BadRequestException = ({massage = 'bad request', status = 400, extra = undefined}={})=>{
    return ErrorException({massage, status, extra})
}
