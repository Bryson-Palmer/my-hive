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

                case 'VIEW_EMPLOYEES_BY_MANAGER':
                    viewEmployeesByManager();
                    return;

                case 'VIEW_TOTAL_BUDGET_FOR_DEPARTMENT':
                    viewTotalBudgetForDept()

                case 'ADD_DEPARTMENT':
                    createDepartment();
                    return;

                case 'ADD_ROLE':
                    createRole();
                    return;

                case 'ADD_EMPLOYEE':
                    createEmployee();
                    return;

                case 'UPDATE_EMPLOYEE_ROLE':
                    modEmployeeRole();
                    return;

                case 'UPDATE_EMPLOYEE_MANAGER':
                    modEmployeeManager();
                    return;

                case 'DELETE_DEPARTMENT':
                    eraseDept();
                    return;

                case 'DELETE_ROLE':
                    eraseRole();
                    return;

                case 'DELETE_EMPLOYEE':
                    eraseEmployee();
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

// View employees by manager
let viewEmployeesByManager = () => {

}

// View employees by manager
let viewTotalBudgetForDept = () => {
    
}

// ------------------- POST Requests ------------------- \\

// Creates a departement and adds it to the department table
let createDepartment = () => {
    console.log('\n');

    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: chalk.greenBright( 'What is the department name being added?' ),
            validate: ( value ) => {
                if( value !== '' ) {
                    return true;
                }
                return console.log( chalk.yellowBright( 'Must provide a department name.' ));
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
                message: chalk.greenBright( 'What department is this role for?' ),
                choices: departmentList
            },

            {
                type: 'input',
                name: 'title',
                message: chalk.greenBright( 'What is the title of this role?' ),
                validate: ( value ) => {
                    if( value !== '' ) {
                        return true;
                    }
                    return console.log( chalk.yellowBright( 'Must provide a title for this role.' ));
                }
            },

            {
                type: 'number',
                name: 'salary',
                message: chalk.greenBright( 'What is the annual salary for this role?' ),
                validate: ( value ) => {
                if( !(isNaN( value ))) {
                        return true;
                    }
                   return console.log( chalk.yellowBright( 'Must provide only numbers.' ));
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
        let roleList = mapEmployeesByRoleId( roles );

        // Getting all employees from employee table
        db.getEmployees()
        .then(( employees ) => {
            
            // Sending employees to be mapped for choices
            let employeeList = mapEmployees( employees );

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: chalk.greenBright( 'What is the first name of this employee?' ),
                    validate: ( value ) => {
                        if( value !== '' ) {
                            return true;
                        }
                        return console.log( chalk.yellowBright( 'Must provide a first name for this employee.' ));
                    }
                },

                {
                    type: 'input',
                    name: 'last_name',
                    message: chalk.greenBright( 'What is the last name of this employee?' ),
                    validate: ( value ) => {
                        if( value !== '' ) {
                            return true;
                        }
                        return console.log( chalk.yellowBright( 'Must provide a last name for this employee.' ));
                    }
                },

                {
                    type: 'list',
                    name: 'role_id',
                    message: chalk.greenBright( 'What is the role of this employee?' ),
                    choices: roleList
                },

                {
                    type: 'confrim',
                    name: 'is_manager',
                    message: chalk.greenBright( 'Is this employee a manager? y/n' ),
                    default: 'n'
                },

                {
                    type: 'list',
                    name: 'manager_id',
                    message: chalk.greenBright( "Who is this employee's manager?" ),
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

// Modifies an employee's role
let modEmployeeRole = () => {

    // Getting all employees from employee table
    db.getEmployees()
    .then(( employees ) => {
        
        // Sending employees to be mapped for choices
        let employeeList = mapEmployeesById( employees );
        
        // Getting all roles from role table
        db.getRoles()
        .then(( roles )  => {
        
            // Sending roles to be mapped for choices
            let roleList = mapRoles( roles );

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'id',
                    message: chalk.greenBright( 'Who is the employee you want to change the roll for?' ),
                    choices: employeeList
                },
        
                {
                    type: 'list',
                    name: 'role_id',
                    message: chalk.greenBright( 'What role would you like to assign this empolyee?' ),
                    choices: roleList
                },
        
            ])
            .then(( newRole ) => {
                // Sending res newRole to db to be queried
                db.updateEmployeeRole( newRole );
                whatNext();
            });
        });
    });
}

// Modifies an employee's assigned manager
let modEmployeeManager = () => {
    
    // Getting all employees from employee table
    db.getEmployees()
    .then(( employees ) => {

        // Mapping employee list
        let employeeList = mapEmployeesById( employees );

        // Sorting managers
        let manager = getManagers( employees );

        // Mapping managers
        let managerList = mapManagers( manager );

        inquirer.prompt([
            {
                type: 'list',
                name: 'id',
                message: chalk.greenBright( 'Which employee needs to be assigned a new manager?' ),
                choices: employeeList
            },

            {
                type: 'list',
                name: 'manager_id',
                message: chalk.greenBright( 'Which manager would you like to assign this employee?' ),
                choices: managerList
            },

        ])
        .then(( answers ) => {
            db.updateEmployeeManager( answers );
            whatNext();
        });
    });
    
}

// ------------------- DELETE Requests ------------------- \\

// Delete a department by id
let eraseDept = () => {

}

// Delete a role by id
let eraseRole = () => {

}

// Delete an employee by id
let eraseEmployee = () => {
    
}

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

// Mapping employee's role id/name into a variable to be used as choices later
let mapEmployeesByRoleId = employees => 
    employees.map(( employee ) => ({
        value: employee.role_id, 
        name: `${employee.first_name} ${employee.last_name}`
    }));

// Mapping employee's id into a variable to be used as choices later
let mapEmployeesById = employees => 
    employees.map(( employee ) => ({
        value: employee.id,
        name: `${employee.first_name} ${employee.last_name}`
    }));

// Mapping managers into a variable to be used as choices later
let mapManagers = managers => 
    managers.map(( manager ) => ({
        value: manager.id,
        name: `${manager.first_name} ${manager.last_name}`
    }));

// Mapping employee's id into a variable to be used as choices later
let getManagers = employees => {
    
    // New array for managers
    let manager = [];

    // For loop over employees
    for( let i = 0; i < employees.length -1; ++i ) {

        // If manager id is null
        // Push to new array
        if( employees[i].manager_id === null ) {
            manager.push( employees[i] );
        }
    }
    // Return!!!
    return manager;
}


console.log( chalk.greenBright( logo( config ).render() ));

whatNext();
