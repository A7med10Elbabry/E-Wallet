import { userModel } from "../../DB/model/index.js"



userModel.create()
export const findOne = async ({model, where, extra}={})=>{
    model.findOne({
        where
    })
}

export const findAll = async ({model, where, extra}={})=>{
    return model.findAll({
        where
    })
}

export const createOne = async ({model, data}={})=>{
    return model.create(data)
}


