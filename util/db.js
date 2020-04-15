//contains db connection logic
const mysql = require('mysql2');

//DB crdentials
const connection = mysql.createPool({
  host:'localhost',
  user:'nodejs',
  database:'nodejs_db',
  password:'node'
});


//return a promised connection pool
module.exports = connection.promise()