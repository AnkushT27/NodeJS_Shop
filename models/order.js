const Sequelize = require('sequelize');
const sequelize = require('../util/db');

module.exports = sequelize.define('order',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    }
})