// const db = require('../db/connection');
// const cTable = require('console.table');

// const   userInput  = require('../server');

// const viewRoles = () => {
//    sql = `SELECT * FROM empRole`;

//    db.promise().query(sql, (err, rows) => {
//       if (err) throw err;
//       console.table(rows);
//    })
//    .then(() =>{
//       userInput;
//    })
// };

// const viewRoles = () => {
//    return new Promise((resolve, reject) => {
//       const sql = `SELECT * FROM empRole`;

//       db.query(sql, (err, rows) => {
//          if (err) {
//             return reject(err);
//          }
//          resolve(console.table(rows));
//       })
//    })
//    .then(() =>{
//       return userInput();
//    })
// }

// module.exports =  viewRoles ;