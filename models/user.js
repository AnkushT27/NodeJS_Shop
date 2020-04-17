const Sequelize = require('sequelize');
const sql = require('../util/db');

module.exports = sql.define('user',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING
    },
    email:{
        type:Sequelize.STRING
    }
},{timestamps:false})