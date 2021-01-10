-- Creating a seed file to populate the database with initial data

USE myHive_db;

INSERT INTO department
    (name)
VALUES
    ('Engineering'),
    ('Sales'),
    ('Accounting'),
    ('Marketing');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Lead Engineeer', 175000, 1),
    ('Software Engineer', 135000, 1),
    ('Sales Leader', 115000, 2),
    ('Salesperson', 92000, 2),
    ('Lead Accountant', 125000, 3),
    ('Accountant', 105000, 3),
    ('Lead Marketing Consultant', 140000, 4),
    ('Marketing Consultant', 111000, 4);

    INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Backus', 1, NULL),
    ('Émile', 'Baudot', 2, 1),
    ('Tim', 'Berners-Lee', 3, NULL),
    ('George', 'Boole', 4, 3),
    ('Margaret','Hamilton' , 5, NULL),
    ('Dorothy', 'Vaughan', 6, 5),
    ('Katherine', 'Johnson', 7, NULL),
    ('Mary', 'Jackson', 8, 7);