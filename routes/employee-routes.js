const express = require('express');
const {addEmployee, 
       getAllEmployees, 
       getEmployee,
       editEmployee,
       deleteEmployee
      } = require('../controllers/employeeController');
const isAuth = require("../middleware/is-auth");


const router = express.Router();

router.post('/employee',isAuth, addEmployee);
router.get('/employees',isAuth, getAllEmployees);
router.get('/employee/:id',isAuth, getEmployee);
router.patch('/employee/:id',isAuth, editEmployee);
router.delete('/employee/:id',isAuth, deleteEmployee);


module.exports = {
    routes: router
}