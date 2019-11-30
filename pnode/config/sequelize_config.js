const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
const sequelize = new Sequelize('c_m_s', 'root', 'root', {
  host: 'localhost',
  dialect:'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});

// Option 2: Passing a connection URI
//const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

var test = sequelize
.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
}).done();

module.exports = sequelize;