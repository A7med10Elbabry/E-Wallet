import { Sequelize } from "sequelize";
import { DB_NAME, DB_PASSWORD, DB_USER } from "../../config/config.service.js";


export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
host: 'localhost',
dialect: 'postgres'
});


export const connectDB = async () => {
    try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}
}
export const syncDB = async () => {
    await sequelize.sync({ force: false , alter: true });
    console.log('DB synchronized successfully.');
}
