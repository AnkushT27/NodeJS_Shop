const Sequelize = require('sequelize');
const sequelize = require('../util/db');

module.exports = sequelize.define('orderitem',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    quantity:Sequelize.INTEGER
})