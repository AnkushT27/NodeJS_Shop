const Sequelize = require('sequelize');
const sequelize = require('../util/db');

module.exports = sequelize.define('cart',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    }
})