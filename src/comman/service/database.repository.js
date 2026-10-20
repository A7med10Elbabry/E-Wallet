import e from "express"

export const findOne = async ({model, where, extra}={})=>{
    return await model.findOne({
        where
    })
}

export const findAll = async ({model, where, extra}={})=>{
    return await model.findAll({
        where
    })
}




export const createOne = async ({model, data, extra})=>{
    return await model.create({...data})
}


