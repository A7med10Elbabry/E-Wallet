import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../connection.db.js";
import { generateHash } from "../../comman/utiltes/security/index.js";
import { encrypt, decrypt } from "../../comman/utiltes/security/encryption.security.js";
import { WalletModel } from "./wallet.model.js";

export const userModel = sequelize.define(
  'user',
  {
    ID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    // Model attributes are defined here
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone:{
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    role:{
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
    },
    changeCredentialsTime:{
      type: DataTypes.DATE,
      allowNull: true,
    },
    confirmEmail:{
      type: DataTypes.DATE,
      defaultValue: null,
    }
  },
  {
   createdAt: true,
   deletedAt: true,
  },
);

userModel.beforeCreate( async (user, options) => {
  user.password = await generateHash(user.password);
  user.phone = await encrypt(user.phone);
});

userModel.beforeUpdate( async (user, options) => {
  if (user.changed('password')) {
    user.password = await generateHash(user.password);
  }
  if (user.changed('phone')) {
    user.phone = await encrypt(user.phone);
  }
});

userModel.afterFind(async (user, options) => {
  if (user && user.phone) {
    user.phone = await decrypt(user.phone);
  }
})


userModel.hasOne(WalletModel,{
  foreignKey:"ID"
})
WalletModel.belongsTo(userModel,{
    foreignKey:"userId"
})
