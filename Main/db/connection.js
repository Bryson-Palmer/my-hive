const util = require('util');
const mysql = require('mysql');

// Create connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Blumoon123',
    database: 'myHive_db'
});

// Establish connection
connection.connect();

// Setting up connection.query to use promises instead of callbacks
// This allows us to use the asyn/await syntax
connection.query = util.promisify(connection.query);

// Export the module
module.exports = connection;