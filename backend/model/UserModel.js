import { Sequelize } from "sequelize";
import db from "../config/Database.js";


const { DataTypes } = Sequelize;

const User = db.define('users',{
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    gender: DataTypes.STRING,
    refresh_token: DataTypes.TEXT
},{
    freezeTablename : true
})

export default User;


