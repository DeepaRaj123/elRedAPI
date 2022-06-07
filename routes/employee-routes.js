const express = require('express');
const {addEmployee, 
       getAllEmployees, 
       getEmployee,
       editEmployee,
       deleteEmployee
      } = require('../controllers/employeeController');


const router = express.Router();

router.post('/employee', addEmployee);
router.get('/employees', getAllEmployees);
router.get('/employee/:id', getEmployee);
router.patch('/employee/:id', editEmployee);
router.delete('/employee/:id', deleteEmployee);


module.exports = {
    routes: router
}