// index.js just exports an object with functions that handle all of the actions with your database
// Go to that object and call any one of the specific queries to the database

// Import connection 
const connection = require('./connection');
const chalk = require('chalk');

module.exports = {

    getDepartments() {
        // Have to return the promise so when function is called 
        // we can use the .then in the root index
        return connection.query( 'SELECT * FROM department' );
    },

    getRoles() {
        return connection.query('SELECT * FROM role');
    },

    getEmployees() {
        return connection.query('SELECT * FROM employee');
    },

    addDepartment( data ) {
        return connection.query('INSERT INTO department SET ?',
        {
            name: data.name
        },
        function(err) {
            if (err) throw err;
            console.log( chalk.greenBright( '\n\nSuccess!!!\n\nDepartment (' + data.name + ') added.'));
        });
    },

    addRole( data ) {
        const dataInput = {
            title: data.title,
            salary: data.salary,
            department_id: data.department_id
        }
        return connection.query('INSERT INTO role SET ?', dataInput,
        function(err) {
            if (err) throw err;
            console.log( chalk.greenBright('\n\nSuccess!!!\n\nRole (' + data.title + ') added.'));
        });
    }

}
