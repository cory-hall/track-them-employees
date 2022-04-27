const mysql2 = require('mysql2');

// connect to localhost server
const db = mysql2.createConnection({
   host: 'localhost',
   user: 'root',
   password: 'password1',
   database: 'team'
});

module.exports = db;