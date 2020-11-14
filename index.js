// DEPENDENCIES
var mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
require("dotenv").config();

// Classes
const Department = require("./lib/Department");
const Employee = require("./lib/Employee");
const Roles = require("./lib/Roles");

// MYSQL SETUP
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Connect to database
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    init();
});

// Start Application
function init() {
    console.log("------------------------------------------------------------------------------");
    console.log("---------------------   WELCOME TO EMPLOYEE TRACKER   ------------------------");
    console.log("------------------------------------------------------------------------------");
    initMenu();
};

// Main menu
function initMenu() {
    inquirer
        .prompt({
            name: "initMenu",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Employees By Department",
                "View All Employees By Manager",
                "Add Employee",
                "Remove Employee",
                "Update Employee Title",
                "Update Employee Manager",
                new inquirer.Separator(),
                "View All Departments",
                "Add Department",
                "Remove Department",
                new inquirer.Separator(),
                "View All Roles",
                "Add Role",
                "Remove Role",
                new inquirer.Separator(),
                "Exit",
                new inquirer.Separator()
            ]
        }).then(response => {
            switch (response.initMenu) {

                case "View All Employees":
                    return queryEmployees("all");

                case "View All Employees By Department":
                    return queryEmployees("department");

                case "View All Employees By Manager":
                    return queryEmployees("manager");

                case "Exit":
                    return connection.end();
            }
        });

}

// Show Employees
function queryEmployees(filter) {

    // All employees
    if (filter === "all") {
        let query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, role.department_id, employee.manager_id, department.name FROM employee "
        query += "INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role.department_id = department.id) ORDER BY employee.id ASC;";
        connection.query(query, function (err, res) {
            if (err) throw err;
            //console.log(res);
            let employeeArray = [];
            let manager = "";
            res.forEach(employee => {
                if (employee.manager_id != null) {
                    manager = `${res[employee.manager_id].first_name} ${res[employee.manager_id].last_name}`
                } else {
                    manager = "null"
                }
                const newEmployee = new Employee(employee.id, employee.first_name, employee.last_name, employee.title, employee.name, employee.salary, manager);
                employeeArray.push(newEmployee);
            });
            console.table(employeeArray);
            initMenu();
        });
    }

    // Employees by manager
    if (filter === "manager") {
        let query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, role.department_id, employee.manager_id, department.name FROM employee "
        query += "INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role.department_id = department.id) ORDER BY employee.id ASC;";
        connection.query(query, function (err, res) {
            if (err) throw err;
            //console.log(res);
            let employeeArray = [];
            let manager = "";
            res.forEach(employee => {
                if (employee.manager_id != null) {
                    manager = `${res[employee.manager_id].first_name} ${res[employee.manager_id].last_name}`
                } else {
                    manager = "null"
                }
                const newEmployee = new Employee(employee.id, employee.first_name, employee.last_name, employee.title, employee.name, employee.salary, manager);
                employeeArray.push(newEmployee);
            });
            console.table(employeeArray);
            initMenu();
        });
    }

    // Employees by department
    if (filter === "department") {
        let query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, role.department_id, employee.manager_id, department.name FROM employee "
        query += "INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role.department_id = department.id) ORDER BY employee.id ASC;";
        connection.query(query, function (err, res) {
            if (err) throw err;
            //console.log(res);
            let employeeArray = [];
            let manager = "";
            res.forEach(employee => {
                if (employee.manager_id != null) {
                    manager = `${res[employee.manager_id].first_name} ${res[employee.manager_id].last_name}`
                } else {
                    manager = "null"
                }
                const newEmployee = new Employee(employee.id, employee.first_name, employee.last_name, employee.title, employee.name, employee.salary, manager);
                employeeArray.push(newEmployee);
            });
            console.table(employeeArray);
            initMenu();
        });
    }

}

// Create Employee
function addEmployee() {

}

// Remove Employee
function removeEmployee() {
    
}

// Update Employee
function updateEmployee(type) {
    if (type === "title") {

    }

    if (type === "manager") {

    }    
}