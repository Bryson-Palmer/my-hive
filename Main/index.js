const connection = require('./db/connection');
const inquirer = require('inquirer');
const chalk = require('chalk');
const logo = require('asciiart-logo');
const config = require('./package.json');
const db = require('./db');
const { createPromptModule } = require('inquirer');

// Brings up a list of what the user can do next
let whatNext = () => {
    // console.log('\n\n')
    inquirer
        .prompt({
            type: 'list',
            name: 'action',
            message: chalk.greenBright('\nWhat would you like to do?'),
            choices: [
                new inquirer.Separator(),
                'VIEW_DEPARTMENTS',
                'VIEW_ROLES',
                'VIEW_EMPLOYEES',
                'VIEW_EMPLOYEES_BY_MANAGER',
                'VIEW_TOTAL_BUDGET_FOR_DEPARTMENT',
                new inquirer.Separator(),
                'ADD_DEPARTMENT',
                'ADD_ROLE',
                'ADD_EMPLOYEE',
                new inquirer.Separator(),
                'UPDATE_EMPLOYEE_ROLE',
                'UPDATE_EMPLOYEE_MANAGER',
                new inquirer.Separator(),
                'DELETE_DEPARTMENT',
                'DELETE_ROLE',
                'DELETE_EMPLOYEE',
                new inquirer.Separator(),
                'QUIT',
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

                case 'ADD_EMPLOYEE':
                    createEmployee();
                    return;

                case 'ADD_EMPLOYEE':
                    createEmployee();
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

// View all departments
let viewDepartments = () => {
    console.log('\n');

    // Getting all departments with query
    db.getDepartments()
    .then(( departments )  => {
        // Console.table departments
        console.table( departments );
        whatNext();
    });
}

// View all roles
let viewRoles = () => {
    console.log('\n');

    // Getting all rolse with query
    db.getRoles()
    .then(( roles ) => {
        // Console.table rolse
        console.table( roles );
        whatNext();
    });  
}

// View all employees
let viewEmployees = () => {
    console.log('\n');

    // Getting all employees with query
    db.getEmployees()
    .then(( employees ) => {
        // Console.table employees
        console.table( employees );
        whatNext();
    });
}

// ------------------- POST Requests ------------------- \\

// Creates a departement and adds it to the department table
let createDepartment = () => {
    console.log('\n');

    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: chalk.greenBright('What is the department name being added?'),
            validate: ( value ) => {
                if( value !== '' ) {
                    return true;
                }
                return console.log( chalk.yellowBright('Must provide a department name.'));
            }
        }
    ])
    .then(( name ) => {
        // Sending res name to db to be queried
        db.addDepartment( name );
        whatNext();
    })
}

// Creates a role and adds it to the role table
let createRole = () => {
    console.log('\n');
   
    // Getting all departments from department table
    db.getDepartments()
    .then(( departments )  => {

        // Sending departments to be mapped for choices
        let departmentList = mapDepartments( departments );
                        
        inquirer.prompt([
            {
                type: 'list',
                name: 'department_id',
                message: chalk.greenBright('What department is this role for?'),
                choices: departmentList
            },

            {
                type: 'input',
                name: 'title',
                message: chalk.greenBright('What is the title of this role?'),
                validate: ( value ) => {
                    if( value !== '' ) {
                        return true;
                    }
                    return console.log( chalk.yellowBright('Must provide a title for this role.'));
                }
            },

            {
                type: 'number',
                name: 'salary',
                message: chalk.greenBright('What is the annual salary for this role?'),
                validate: ( value ) => {
                if( !(isNaN( value ))) {
                        return true;
                    }
                   return console.log( chalk.yellowBright('Must provide only numbers.'));
                }
            }
        ])
        .then((roleData) => {
            // Sending res roleData to db to be queried
            db.addRole( roleData );
            whatNext();     
        });    
    });
};

// Creates an employee and adds it to the employee table
let createEmployee = () => {
    console.log('\n');

    // Getting all roles from role table
    db.getRoles()
    .then(( roles )  => {
        
        // Sending roles to be mapped for choices
        let roleList = mapRoles( roles );

        // Getting all employees from employee table
        db.getEmployees()
        .then(( employees ) => {
            
            // Sending employees to be mapped for choices
            let employeeList = mapEmployees( employees );

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: chalk.greenBright('What is the first name of this employee?'),
                    validate: ( value ) => {
                        if( value !== '' ) {
                            return true;
                        }
                        return console.log( chalk.yellowBright('Must provide a first name for this employee.'));
                    }
                },

                {
                    type: 'input',
                    name: 'last_name',
                    message: chalk.greenBright('What is the last name of this employee?'),
                    validate: ( value ) => {
                        if( value !== '' ) {
                            return true;
                        }
                        return console.log( chalk.yellowBright('Must provide a last name for this employee.'));
                    }
                },

                {
                    type: 'list',
                    name: 'role_id',
                    message: chalk.greenBright('What is the role of this employee?'),
                    choices: roleList
                },

                {
                    type: 'confrim',
                    name: 'is_manager',
                    message: chalk.greenBright('Is this employee a manager? y/n'),
                    default: 'n'
                },

                {
                    type: 'list',
                    name: 'manager_id',
                    message: chalk.greenBright("Who is this employee's manager?"),
                    choices: employeeList,
                    when: ( value ) => value.is_manager === 'n'
                }
            ])
            .then(( employeeData ) => {
                // Sending res employeeData to db to be queried
                db.addEmployee( employeeData );
                whatNext();
                
            })  
        });
    });
};

// ------------------- UPDATE Requests ------------------- \\


// ------------------- DELETE Requests ------------------- \\


// ------------------- MAP FUNCTIONS ------------------- \\

// Mapping departments into a variable to be used as choices
let mapDepartments = departments =>
departments.map( (department) => ({
    value: department.id,
    name: department.name
}));

// Mapping roles into a variable to be used as choices later
let mapRoles = roles => 
roles.map(( role ) => ({
    value: role.id,
    name: role.title
}));

// Mapping employees into a variable to be used as choices later
let mapEmployees = employees => 
employees.map(( employee ) => ({
    value: employee.id,  
    name: `${employee.first_name} ${employee.last_name}`
}));


console.log( chalk.greenBright( logo( config ).render() ));

whatNext();
