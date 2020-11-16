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

// Async Get Managers
async function getManagersAsync(array) {
    let managers = [];
    for (let i = 0; i < array.length; i++) {
        await managers.push(array[i].manager)
    }
    return managers
}

// Async Get Departments
async function getDepartmentsAsync(array) {
    let departments = [];
    for (let i = 0; i < array.length; i++) {
        await departments.push(array[i].name)
    }
    return departments
}

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
                    return queryEmployees("", "");

                case "View All Employees By Department":
                    return employeeByDepartment();

                case "View All Employees By Manager":
                    return employeeByManager();

                case "Exit":
                    return connection.end();
            }
        });

}

// Query Employees
function queryEmployees(type, filter) {

    let query = "SELECT e.id, e.first_name, e.last_name, title, name, salary, CONCAT_WS(' ', e2.first_name, e2.last_name) manager FROM employee e ";
    query += "INNER JOIN role ";
    query += "ON role_id = role.id ";
    query += "INNER JOIN department ";
    query += "ON role.department_id = department.id ";
    query += "LEFT JOIN employee e2 ON e.manager_id = e2.id ";
    if (type === "manager") {
        query += "WHERE CONCAT_WS(' ', e2.first_name, e2.last_name) = ? ";
    }
    else if (type === "department") {
        query += "WHERE name = ? ";
    }
    query += "ORDER BY e.id ASC";
    connection.query(query, [filter], (err, res) => {
        if (err) throw err;
        //console.log(res);
        let employeeArray = [];
        res.forEach(employee => {
            const newEmployee = new Employee(employee.id, employee.first_name, employee.last_name, employee.title, employee.name, employee.salary, employee.manager);
            employeeArray.push(newEmployee);
        });
        console.table(employeeArray);
        initMenu();
    });
}

// Get Employee by Manager
function employeeByManager() {
    let query = "SELECT DISTINCT CONCAT_WS(' ', e2.first_name, e2.last_name) manager FROM employee e ";
    query += "INNER JOIN employee e2 ON e.manager_id = e2.id ";
    query += "ORDER BY e.id ASC";
    connection.query(query, (err, res) => {
        // Get managers asynchronously 
        getManagersAsync(res).then((result) => {
            //console.log(result);
            inquirer
                .prompt({
                    name: "selManager",
                    type: "list",
                    message: "Selected A Manager To Filter By:",
                    choices: result
                }).then(response => {
                    queryEmployees("manager", response.selManager);
                });
        });
    });
}

// Get Employee by Department
function employeeByDepartment() {
    let query = "SELECT name FROM department ";
    query += "ORDER BY id ASC";
    connection.query(query, (err, res) => {
        // Get managers asynchronously 
        getDepartmentsAsync(res).then((result) => {
            //console.log(result);
            inquirer
                .prompt({
                    name: "selDepartment",
                    type: "list",
                    message: "Selected A Department To Filter By:",
                    choices: result
                }).then(response => {
                    queryEmployees("department", response.selDepartment);
                });
        });
    });
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