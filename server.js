// required libraries
const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

// global arrays
let allRoles = [];
let allDepts = [];
let allEmps = [];

// main questions
const questions = [
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

// initial database function
const init = () => {
   db.connect(err => {
      if (err) throw err;
      console.log('Database connected.');
      userInput();
   });
};

// main question display and inquirer function
const userInput = async () => {
   return inquirer.prompt([
      {
         type: 'list',
         name: 'userInput',
         message: 'What would you like to do?',
         choices: questions
      }
   ])
   // switch statement to direct after inquirer prompt
      .then(data => {
         switch (data.userInput) {
            case 'View All Employees':
               viewEmployees();
               break;
            case 'Add Employee':
               addEmployee();
               break;
            case 'Update Employee Role':
               updateEmployee();
               break;
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
            default:
               break;
         }
      })
};

// end the app
const exitApp = () => {
   console.log('Goodbye');
   db.end();
   process.exit();
}

// MAIN USE FUNCTIONS END //

// ROLE FUNCTIONS BEGIN //

// get all employee roles
const getRoles = async () => {
   const sql = `SELECT title FROM empRole`;

   db.query(sql, (err, rows) => {
      if (err) throw err;
      rows.forEach(element => {
         allRoles.push(element.title);
      })
   })
}

// view all employee roles in console
const viewRoles = () => {
   const sql = `SELECT * FROM empRole`;

   db.query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      userInput();
   });
};

// add an employee role to the database
const addRole = () => {
   getAllDepartments();

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
   // finding what department the role is in
   // and add to database
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

// get all departments
const getAllDepartments = async () => {
   const sql = `SELECT name FROM department`;

   db.query(sql, (err, rows) => {
      if (err) throw err;
      rows.forEach((element) => {
         allDepts.push(element);
      });
   });
};

// view all departments in console
const viewDepartments = () => {
   const sql = `SELECT * FROM department`

   db.query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      userInput();
   });
};

// add a department to the database
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

// ** couldn't get this one to work
//    brute forced it where I wanted to apply it **

// const getEmployees = async () => {
//    const sql = `SELECT * FROM employee`;

//    db.query(sql, (err, rows) => {
//       if (err) throw err;
//       rows.forEach((element) => {
//          let first = element.first_name;
//          let second = element.last_name;
//          let result = first.concat(" ", second);
//          allEmps.push(result);
//       });
//    });
// };

// view all employees in the console
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

// add employee to the database
const addEmployee = () => {
   // get all roles, save to empRoles global array
   getRoles();

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
   // determine which role the employee will have
      .then(data => {
         let index = allRoles.findIndex(element => {
            if (element === data.empRole) {
               return true;
            }
         })
         index += 1;

         const sql = `INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)`;
         const params = [data.firstName, data.lastName, index];

         db.query(sql, params, (err, result) => {
            if (err) throw err;
         })
         console.log("New employee successfully added.");
      })
      .then(() => {
         userInput();
      })
};

// update employee role
const updateEmployee = () => {
   const empQuery = `SELECT * FROM employee`;
   const roleQuery = `SELECT * FROM empRole`;

   // access both employee table and employee role table
   db.query(empQuery, (err, employees) => {
      if (err) throw err;
      db.query(roleQuery, (err, roles) => {
         if (err) throw err;

         inquirer.prompt([
            {
               type: 'list',
               name: 'empName',
               message: "Which employee's role do you need to change?",
               choices: function () {
                  let empArray = [];
                  employees.forEach(element => {
                     empArray.push(`${element.first_name} ${element.last_name}`);
                  });
                  return empArray;
               }
            },
            {
               type: 'list',
               name: 'empRole',
               message: "What is the employee's new role?",
               choices: function () {
                  let empArray = [];
                  roles.forEach(element => {
                     empArray.push(element.title);
                  });
                  return empArray;
               }
            }
         ])
         // update role for employee
            .then((data) => {
               roles.forEach(element => {
                  if (element.title === data.empRole) {
                     data.role_id = element.id;
                  }
               })
               // select the appropriate employee
               employees.forEach(element => {
                  if (`${element.first_name} ${element.last_name}` === data.empName) {
                     data.id = element.id;
                  }
               })

               const sql = `UPDATE employee SET employee.role_id = ${data.role_id}
                           WHERE employee.id = ${data.id}`;

               db.query(sql, (err) => {
                  if (err) throw err;
                  console.log(`${data.empName}'s role has been updated. `)
                  userInput();
               })
            })
      })
   })
}

// EMPLOYEE FUNCTIONS END //

init();

module.exports = userInput;




