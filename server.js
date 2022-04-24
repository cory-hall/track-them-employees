const db = require('./db/connection');
const inquirer = require('inquirer');

const viewEmployees = require('./lib/employee');
const viewDepartments = require('./lib/department');
const viewRoles = require('./lib/role');

const questions = [
   'View All Employees',
   'Add Employee',
   'Update Employee Role',
   'View All Roles',
   'Add Role',
   'View All Departments',
   'Add Department'
];

const init = () => {
   db.connect(err => {
      if (err) throw err;
      console.log('Database connected.');
      userInput();
   });
};

const userInput = () => {
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
               viewEmployees()
               break;
            // case 'Add Employee':
            //    addEmployee();
            // case 'Update Employee Role':
            //    updateEmployee();
            case 'View All Roles':
               viewRoles()
               break;
            // case 'Add Role':
            //    addRole();
            case 'View All Departments':
               viewDepartments()
               break;
            // case 'Add Department':
            //    addDepartment();
         }
      })
      .then(response => {
         return userInput();
      })
}

init();

module.exports = userInput;


