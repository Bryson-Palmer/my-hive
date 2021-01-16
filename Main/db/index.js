// index.js just exports an object with functions that handle all of the actions with your database
// Go to that object and call any one of the specific queries to the database

// Import connection 
const connection = require('./connection');
const chalk = require('chalk');

module.exports = {

    // ------------------- GET Requests ------------------- \\


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

    // Query select all employees by manager
    getEmployeesByManager( managerId ) {
        let x = connection.query( 
        `SELECT 
            CONCAT
                (e.first_name, " ", e.last_name) AS Employees, e.manager_id,
            CONCAT
                (m.first_name, " ", m.last_name) AS Manager, m.id
            FROM 
                employee e, employee m
            WHERE 
                m.? 
            AND 
                m.id = e.manager_id
            ORDER BY 
                Manager`,
            {
                id: managerId.id
            },
            function(err, results) {
                if (err) throw err;
                console.log( '\n' );
                console.table(  results );
            });
        return x;      
    },

    // Query select total budget for department
    // getTotalBudgetForDepartment() {
    //     return;
    // },

    // ------------------- POST Requests ------------------- \\

    // Query insert a new department into department table
    addDepartment( deptName ) {
        return connection.query( 'INSERT INTO department SET ?',
        {
            name: deptName.name
        },
        function(err) {
            if (err) throw err;
            console.log( chalk.greenBright( '\n\nSuccess!!!\n\nDepartment (' + deptName.name + ') added.' ));
        });
    },

    // Query insert a new role into role table
    addRole( roleData ) {
        const roleInput = {
            title: roleData.title,
            salary: roleData.salary,
            department_id: roleData.department_id
        }
        return connection.query( 'INSERT INTO role SET ?', roleInput,
        function(err) {
            if (err) throw err;
            console.log( chalk.greenBright( '\n\nSuccess!!!\n\nRole (' + roleData.title + ') added.' ));
        });
    },

    // Query insert a new employee into employee table
    addEmployee( employeeData ) {
        const employeeInput = {
            first_name: employeeData.first_name,
            last_name: employeeData.last_name,
            role_id: employeeData.role_id,
            manager_id: employeeData.manager_id
        }
        return connection.query( 'INSERT INTO employee SET ?', employeeInput,
        function(err) {
            if (err) throw err;
            console.log( chalk.greenBright( '\n\nSuccess!!!\n\nEmployee (' + employeeData.first_name + ' ' + employeeData.last_name + ') added.' ));
        });
    },
    
    // ------------------- UPDATE Requests ------------------- \\

    // Query update employee role
    updateEmployeeRole( employeeData ) {
        return connection.query( 'UPDATE employee SET ? WHERE ?', 
        [
            {
                role_id: employeeData.role_id
            },
            {
                id: employeeData.id
            }
        ],
        function(err) {
            if (err) throw err;
            console.log( chalk.greenBright( "\n\nSuccess!!!\n\nEmployee's role changed to (" + employeeData.role_id +")." ));
        });
    },

    // Query update employee manager
    updateEmployeeManager( employeeData ) {
        return connection.query( 'UPDATE employee SET ? WHERE ?',
        [
            {
                manager_id: employeeData.manager_id
            },
            {
                id: employeeData.id
            }
        ],
        function(err, results) {
            if (err) throw err;
            console.log( chalk.greenBright( "\n\nSuccess!!!\n\nEmployee's manager ID changed to (" + employeeData.manager_id + ")" ));
        })

    },

    // ------------------- DELETE Requests ------------------- \\

    // Query delete department
    deleteDepartment( department ) {
        return connection.query( 'DELETE FROM department WHERE ?', 
        {
            id: department.id
        },
        function(err, results) {
            if (err) throw err;
            console.log( chalk.redBright( '\n\nSuccess!!!\n\nYou have permanently deleted department (' + department.id + ')'));
        });
    },

    // Query delete role
    deleteRole( role ) {
        return connection.query( 'DELETE FROM role WHERE ?',
        {
            id: role.id
        },
        function(err, results) {
            if (err) throw err;
            console.log( chalk.redBright( '\n\nSuccess!!!\n\nYou have permanently deleted department (' + role.id + ')'));
        })
    },

    // Query delete employee
    deleteEmployee( employee ) {
        return connection.query( 'DELETE FROM employee WHERE ?',
        {
            id: employee.id
        },
        function(err, results) {
            if (err) throw err;
            console.log( chalk.redBright( '\n\nSuccess!!!\n\nYou have permanently deleted department (' + employee.id + ')'));
        })
    },

}
