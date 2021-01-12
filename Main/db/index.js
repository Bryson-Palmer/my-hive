// index.js just exports an object with functions that handle all of the actions with your database
// Go to that object and call any one of the specific queries to the database

// Import connection 
const connection = require('./connection');
const chalk = require('chalk');

module.exports = {

    // Query select all departments from department table
    getDepartments() {
        // Have to return the promise so when function is called 
        // we can use the .then in the root index
        return connection.query( 'SELECT * FROM department' );
    },

    // Query select all roles from role table
    getRoles() {
        return connection.query( 'SELECT * FROM role' );
    },
    // Query select all employees from employee table
    getEmployees() {
        return connection.query( 'SELECT * FROM employee' );
    },

    // Query insert a new department into department table
    addDepartment( data ) {
        return connection.query( 'INSERT INTO department SET ?',
        {
            name: data.name
        },
        function(err) {
            if (err) throw err;
            console.log( chalk.greenBright( '\n\nSuccess!!!\n\nDepartment (' + data.name + ') added.' ));
        });
    },

    // Query insert a new role into role table
    addRole( data ) {
        const roleInput = {
            title: data.title,
            salary: data.salary,
            department_id: data.department_id
        }
        return connection.query( 'INSERT INTO role SET ?', roleInput,
        function(err) {
            if (err) throw err;
            console.log( chalk.greenBright( '\n\nSuccess!!!\n\nRole (' + data.title + ') added.' ));
        });
    },

    // Query insert a new employee into employee table
    addEmployee( data ) {
        const employeeInput = {
            first_name: data.first_name,
            last_name: data.last_name,
            role_id: data.role_id,
            manager_id: data.manager_id
        }
        return connection.query( 'INSERT INTO employee SET ?', employeeInput,
        function(err){
            if (err) throw err;
            console.log( chalk.greenBright( '\n\nSuccess!!!\n\nEmployee (' + data.first_name + ' ' + data.last_name + ') added.' ));
        });
    },

}
