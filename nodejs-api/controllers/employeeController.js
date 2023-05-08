const Employee = require("../model/Employee");

const getAllEmployee = async (req, res) => {
  const employees = await Employee.find();
  if (!employees) {
    return res.status(204).json({ message: [] });
  }

  return res.status(200).json(employees);
};

const getEmployeeById = async (req, res) => {
  const id = req.params.id;
  const emp = await Employee.findOne({ _id: id });
  if (emp) {
    res.status(200).json(emp);
  } else {
    res.status(404).json({ error: "Employee Not Found" });
  }
};

const addEmployee = async (req, res) => {
  const newEmp = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  if (!newEmp.firstName || !newEmp.lastName) {
    return res.status(400).json({ message: "First and Last Name can not be empty" });
  }

  try {
    const result = await Employee.create(newEmp);
    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateEmployee = async (req, res) => {
  const id = req.params.id;
  const emp = await Employee.findOne({ _id: id });
  if (emp) {
    emp.firstName = req.body.firstName;
    emp.lastName = req.body.lastName;
    const result = await emp.save();
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ error: "Employee Not Found" });
  }
};

const deleteEmployee = async (req, res) => {
  const id = req.params.id;
  const emp = await Employee.findOne({ _id: id });

  if (emp) {
    const result = await emp.deleteOne();
    return res.status(200).json(result);
  } else {
    res.status(404).json({ error: "Employee Not Found" });
  }
};

module.exports = {
  getAllEmployee,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
