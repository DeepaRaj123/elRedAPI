class Employee {
    constructor(id, taskId,employeeId, employeeName, date, tasksForToday) {
            this.id = id;
            this.taskId = taskId;
            this.employeeId = employeeId;
            this.employeeName = employeeName;
            this.date = date;
            this.tasksForToday = tasksForToday;       
    }
}

module.exports = Employee;