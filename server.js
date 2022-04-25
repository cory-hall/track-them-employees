const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');



const questions = [
   'Get all roles',
   'View All Employees',
   'Add Employee',
   'Update Employee Role',
   'View All Roles',
   'Add Role',
   'View All Departments',
   'Add Department',
   'Exit'
];

// MAIN USE FUNCTIONS BEGIN //

const init = () => {
   db.connect(err => {
      if (err) throw err;
      console.log('Database connected.');
      userInput();
   });
};

const userInput = async () => {
   return inquirer.prompt([
      {
         type: 'list',
         name: 'userInput',
         message: 'What would you like to do?',
         choices: questions
      }
   ])
      .then(data => {
         switch (data.userInput) {
            case 'View All Employees':
               viewEmployees();
               break;
            case 'Add Employee':
               addEmployee();
               break;
            // case 'Update Employee Role':
            //    updateEmployee();
            //    break;
            case 'View All Roles':
               viewRoles();
               break;
            case 'Add Role':
               addRole();
               break;
            case 'View All Departments':
               viewDepartments();
               break;
            case 'Add Department':
               addDepartment();
               break;
            case 'Exit':
               exitApp();
               break;
            case 'Get all roles':
               getRoles();
               break;
            default:
               break;
         }
      })
};

// MAIN USE FUNCTIONS END //

// ROLE FUNCTIONS BEGIN //

const getRoles = () => {
   const sql = `SELECT title FROM empRole`;
   const allRoles = [];

   db.query(sql, (err, rows) => {
      if (err) throw err;
      rows.forEach((element, index) => {
         allRoles.push(element);
      });
   });
   return allRoles;
};

const viewRoles = () => {
   const sql = `SELECT * FROM empRole`;

   db.query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      userInput();
   });
};

const addRole = () => {
   const allDepts = getAllDepartments();

   inquirer.prompt([
      {
         type: 'input',
         name: 'newRole',
         message: 'What role would you like to add?'
      },
      {
         type: 'input',
         name: 'newSalary',
         message: 'What is the salary of this new role?'
      },
      {
         type: 'list',
         name: 'newDept',
         message: 'Which department does this role belong to?',
         choices: allDepts
      }
   ])
      .then(data => {
         let index = allDepts.findIndex(element => {
            if (element.name === data.newDept) {
               return true;
            }
         })
         index += 1;

         const sql = `INSERT INTO empRole(title, department_id, salary) VALUES (?,?,?)`;
         const params = [data.newRole, index, data.newSalary];

         db.query(sql, params, (err, result) => {
            if (err) throw err;
         })
         console.log("New role successfully added.\n")
      })
      .then(() => {
         userInput();
      })
}

// ROLE FUNCTIONS END //

// DEPARTMENT FUNCTIONS BEGIN //

const getAllDepartments = () => {
   const sql = `SELECT name FROM department`;
   const allDepts = [];

   db.query(sql, (err, rows) => {
      if (err) throw err;
      rows.forEach((element, index) => {
         allDepts.push(element);
      });
   });
   return allDepts;
};

const viewDepartments = () => {
   const sql = `SELECT * FROM department`

   db.query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      userInput();
   });
};

const addDepartment = () => {
   inquirer.prompt([
      {
         type: 'input',
         name: 'newDept',
         message: 'What is the name of the new department?'
      }
   ])
      .then(data => {
         const sql = `INSERT INTO department (name) VALUES (?)`;
         const params = [data.newDept];

         db.query(sql, params, (err, result) => {
            if (err) throw err;
         })
         console.log("New department successfully added.\n")
      })
      .then(() => {
         userInput();
      })
}

// DEPARTMENT FUNCTIONS END //

// EMPLOYEE FUNCTIONS BEGIN //

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
      userInput();
   });
};

const addEmployee = () => {
   const allRoles = getRoles();

   inquirer.prompt([
      {
         type: 'input',
         name: 'firstName',
         message: "What is the employee's first name?"
      },
      {
         type: 'input',
         name: 'lastName',
         message: "What is the employee's last name?"
      },
      {
         type: 'list',
         name: 'empRole',
         message: "What is the employee's role?",
         choices: allRoles
      }
   ])
      .then(data => {
         let index = allRoles.findIndex(element => {
            if (element === data.empRole) {
               return true;
            }
            index += 1;
         })
         const sql = `INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)`;
         const params = [data.firstName, data.lastName, index];

         db.query(sql, params, (err, result) => {
            if (err) throw err;
         })
         console.log("New employee successfully added.");
      });
};

// EMPLOYEE FUNCTIONS END //

init();

module.exports = userInput;




