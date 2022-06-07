'use strict';

const req = require('express/lib/request');
const firebase = require('../db');
const Employee = require('../models/employee');
const firestore = firebase.firestore();


const addEmployee = async (req, res, next) => {
    try {

        var newDate = new Date();
        var date = newDate.getDate().toString();
        var month = (newDate.getMonth()+1).toString();
        var year =  newDate.getFullYear().toString();
        var time = newDate.getHours().toString();
        var minutes = newDate.getMinutes().toString();
         const datavalue = req.body;

        const taskRef = await firestore.collection('employees').doc();
       const data = {

      _id:taskRef.id,   
      taskId:date+month+year+time+minutes,
      employeeId:datavalue.employeeId,
      employeeName:datavalue.employeeName,
      date:datavalue.date,
      tasksForToday:datavalue.tasksForToday

       }
        
         taskRef.set(data);
            res.status(201).json({
                success:true, 
                message: 'Employee record created successfully!',
                result: data
              }); 
         
        
    }  catch(err) {
        const message = err.message;
        const type = err.name;
        res.status(500).json({
            success:false, 
            type: type,
            message: message
        });  
      };
}

const getAllEmployees = async (req, res, next) => {
    try {
        const employees = await firestore.collection('employees');
        var queryParam = req.query;
        var query;
        
        if(queryParam.sortOrder==="desc")
        {
            query = employees.orderBy("taskId","desc");
        }
        else if(queryParam.sortOrder==="asc"){
            query = employees.orderBy("taskId","asc");
        }


        const data = await query.get();
        const employeesArray = [];
        if(data.empty) {
            res.status(404).json({
                success:true,
                message: 'No employee records found!',
                result:employeesArray,
                totalItems: employeesArray.length
              });
        }else {
            data.forEach(doc => {
                const employee = new Employee(
                    doc.data()._id,
                    doc.data().taskId,
                    doc.data().employeeId,
                    doc.data().employeeName,
                    doc.data().date,
                    doc.data().tasksForToday
                );
                employeesArray.push(employee);
            });
          res.status(500).json({
            success:true,
            message: 'Fetched employee records successfully.',
            results: employeesArray,
            totalItems: employeesArray.length         })
        }
    }    catch(err) {
        const message = err.message;
        const type = err.name;
        res.status(500).json({
            success:false, 
            type: type,
            message: message
        });  
      };
}

const getEmployee = async (req, res, next) => {
    try {
        const id = req.params.id;
        const employee = await firestore.collection('employees').doc(id);
        const data = await employee.get();
        if(!data.exists) {
            res.status(404).json({
                success:false, 
                type: 'NotFoundError',
                message: 'Employee with the given ID not found'
              });         }else {
            res.send(data.data());
        }
    }  catch(err) {
        const message = err.message;
        const type = err.name;
        res.status(500).json({
            success:false, 
            type: type,
            message: message
        });  
      };
}


const editEmployee = async (req, res, next) => {

 
    try {
        const id = req.params.id;
        const data = req.body;
        const employeeRef = firestore.collection('employees').doc(id);
        const employee = await employeeRef.get();
        if(!employee.exists) {

            res.status(404).json({
                success:false, 
                type: 'NotFoundError',
                message: 'Employee with the given ID not found'
              });   
                }else {
        if(req.body.taskId===undefined)
        {
            const employee =  await firestore.collection('employees').doc(id);
            await employee.update(data);
            var message = [];
            if(req.body.date!=undefined)
            {
                message.push("Date");
            }
            if(req.body.employeeId!=undefined)
            {
                message.push("EmployeeId");
            } if(req.body.employeeName!=undefined)
            {
                message.push("EmployeeName");
            } if(req.body.tasksForToday!=undefined)
            {
                message.push("TasksforToday");
            }
           
            const employeevalue = await firestore.collection('employees').doc(id);
            const datavalue = await employeevalue.get();
                res.status(500).json({
                success:true, 
                message: message + " updated successfully",
                result: datavalue.data()

            }); 
        }
        else{
            res.status(500).json({
                success:false, 
                type: "ReferenceError",
                message: 'TaskId can not be changed'
            }); 
    

        }
    }        
    }  catch(err) {
        const message = err.message;
        const type = err.name;
        res.status(500).json({
            success:false, 
            type: type,
            message: message
        });  
      };
}

const deleteEmployee = async (req, res, next) => {
    try {
        const id = req.params.id;
        const employeeRef = firestore.collection('employees').doc(id);
        const data = await employeeRef.get();
        if(!data.exists) {

            res.status(404).json({
                success:false, 
                type: 'NotFoundError',
                message: 'Employee with the given ID not found'
              });   
                }else {
        
            await employeeRef.delete();
            res.status(500).json({
                success:true, 
                message: 'Record deleted successfully'
              });  
        }
    }
 
     catch(err) {
        const message = err.message;
        const type = err.name;
        res.status(500).json({
            success:false, 
            type: type,
            message: message
        });  
      };
}



module.exports = {
    addEmployee,
    getAllEmployees,
    getEmployee,
    editEmployee,
    deleteEmployee
}