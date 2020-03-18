const mongoose = require('mongoose');
let conn = mongoose.createConnection(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const EmployeeSchema = mongoose.Schema({
  imageId: String,
  name: String,
  position: String,
  linkedIn: String
});

module.exports = conn.model('Employees', EmployeeSchema);
