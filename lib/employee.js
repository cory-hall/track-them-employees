const db = require('../db/connection');
const cTable = require('console.table');
const userInput = require('../server');

const viewEmployees = () => {
   const sql = `SELECT employee.id, employee.first_name, employee.last_name,
                  empRole.title, department.name AS department, empRole.salary
                  FROM employee
                  LEFT JOIN empRole
                  ON employee.role_id = empRole.id
                  LEFT JOIN department
                  ON empRole.department_id = department.id`;

   db.query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows.slice(0));
   });
};

module.exports = viewEmployees;
