const mysql = require('mysql');
const util = require('util');
const chalk = require('chalk');

// Create connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Blumoon123',
    database: 'myHive_db'
});

// Establish connection
connection.connect((err) => {
    // If err connecting throw error
    if(err) throw err;
    // Otherwise console success message
    console.log(chalk.greenBright('\n(Connected as Thread ID: ' + connection.threadId + ')'));
});

// Setting up connection.query to use promises instead of callbacks
// This allows us to use the async/await syntax
connection.query = util.promisify( connection.query );

// Export the module
module.exports = connection;