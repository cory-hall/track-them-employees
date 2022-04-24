const db = require('../db/connection');
const cTable = require('console.table');

const userInput = require('../server')

const viewRoles = () => {
   sql = `SELECT * FROM empRole`;

   db.query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
   });
};

module.exports = viewRoles;