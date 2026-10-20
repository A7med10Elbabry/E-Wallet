import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection.db.js";
import { userModel } from "./user.model.js";
import { CURRENCY_ENUM, STATUS_ENUM } from "../../comman/utiltes/enums/index.js";



export class WalletModel extends Model {};


WalletModel.init(
    {
        ID:{
            type:DataTypes.STRING,
            primaryKey:true,
            allowNull: false
        },
        userId:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        balance:{
            type:DataTypes.FLOAT,
            defaultValue:0
        },
        currency:{
            type:DataTypes.CHAR,
            defaultValue:CURRENCY_ENUM.EGP
        },
        status:{
            type:DataTypes.ENUM(...Object.values(STATUS_ENUM)),
            defaultValue:STATUS_ENUM.ACTIVE
        },

    },{
        sequelize,
        modelName: 'wallet',
        createdAt:true,
        updatedAt:true,
    }
)





