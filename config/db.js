const mysql = require('mysql2');

const db = mysql.createPool({
  connectionLimit: 10, // Maximum number of connections in the pool
  host: "localhost",
  user: "orientso_apwainventory",
  password: '1234',
  database: "orientso_apwainventory",
});


// const db = mysql.createPool({
//     connectionLimit: 10,
//     host: process.env.host,
//     user: process.env.user,
//     password: process.env.password,
//     database: process.env.database,
//   });

// Handle connection errors
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the database.');

    // Perform your queries here
    connection.query('SELECT 1 + 1 AS solution', (queryErr, results) => {
      if (queryErr) {
        console.error('Error executing query:', queryErr);
      } else {
        console.log('Query result:', results);
      }

      // Release the connection back to the pool
      connection.release();
    });
  }
});

module.exports = db;