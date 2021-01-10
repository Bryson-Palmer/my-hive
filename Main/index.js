const connection = require('./db/connection');
const inquirer = require('inquirer');
const chalk = require('chalk');
const logo = require('asciiart-logo');
const config = require('./package.json');
const db = require('./db');
const { createPromptModule } = require('inquirer');

function askForAction() {
    console.log('\n')
    inquirer
        .prompt({
            type: 'list',
            name: 'action',
            message: chalk.greenBright('What would you like to do?'),
            choices: [
                'VIEW_DEPARTMENTS',
                'VIEW_ROLES',
                'VIEW_EMPLOYEES',
                'ADD_DEPARTMENT',
                'ADD_ROLE',
                'QUIT'
            ]
        })
        .then((res) => {
            switch (res.action) {
                case 'VIEW_DEPARTMENTS':
                    viewDepartments();
                    return;
        
                case 'VIEW_ROLES':
                    viewRoles();
                    return;
        
                case 'VIEW_EMPLOYEES':
                    viewEmployees();
                    return;

                case 'ADD_DEPARTMENT':
                    createDepartment();
                    return;

                case 'ADD_ROLE':
                    createRole();
                    return;
 
                default:
                    console.log( chalk.greenBright( '\n\n               --'));
                    console.log( chalk.greenBright( '            --------'));
                    console.log( chalk.greenBright( '          -------->*<-'));
                    console.log( chalk.greenBright( '         --------------'));
                    console.log( chalk.greenBright( '\n        |  myHive out  | \n'));
                    console.log( chalk.greenBright( '         --------------'));
                    console.log( chalk.greenBright( '          ------------'));
                    console.log( chalk.greenBright( '            --------\n\n'));
                    connection.end();
            }
        });
}

// ------------------- GET Requests ------------------- \\

function viewDepartments() {
    console.log('\n');

    db
        .getDepartments()
        .then(( departments )  => {
            console.table( departments );
            askForAction();
        });

}

function viewRoles() {
    console.log('\n');

    db
        .getRoles()
        .then(( roles ) => {
            console.table( roles );
            askForAction();
        });
        

}

function viewEmployees() {
    console.log('\n');

    db
        .getEmployees()
        .then(( employees ) => {
            console.table( employees );
            askForAction();
        });

}

// ------------------- POST Requests ------------------- \\

function createDepartment() {
    console.log('\n');

    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: chalk.greenBright('What is the department name being added?'),
                validate: function( value ) {
                    if( value !== "" ) {
                        return true;
                    }
                    return console.log( chalk.yellowBright('Must provide a department name.'));
                    
                }
            }
        ])
        .then(( name ) => {
            db.addDepartment( name );
            askForAction();
        })
}

function createRole() {
    console.log('\n');
   
    // Getting departments
    db.getDepartments()
    .then(( departments )  => {

        const departmentOptions = departments.map( (department) => ({
            value: department.id,
            name: department.name
        }))
                        
        inquirer.prompt([
            {
                type: 'list',
                name: 'department_id',
                message: chalk.greenBright('What department is this role for?'),
                choices: departmentOptions
            },

            {
                type: 'input',
                name: 'title',
                message: chalk.greenBright('What is the title of this role?'),
                validate: function( value ) {
                    if( value !== "" ) {
                        return true;
                    }
                    return console.log( chalk.yellowBright('Must provide a title for this role.'));
                }
            },

            {
                type: 'number',
                name: 'salary',
                message: chalk.greenBright('What is the annual salary for this role?'),
                validate: function( value ) {
                if( !(isNaN( value ))) {
                        return true;
                    }
                   return console.log( chalk.yellowBright('Must provide only numbers.'));
                }
            }
        ])
        .then((roleData) => {
            db.addRole( roleData );
            askForAction();     
        });
            
    });
  
};


console.log( chalk.greenBright( logo( config ).render() ));

askForAction();
