//contains db connection logic
const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('nodejs_db','nodejs','node',{
  host:'localhost',
 dialect:'mysql'
})

//return a promised connection pool
module.exports = sequelize;