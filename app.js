const express = require('express');
const mongoose = require('mongoose');
const bodyParse = require('body-parser');
const GridFsStream = require('gridfs-stream');
const path = require('path');
const cors = require('cors');

require('dotenv/config');

const app = express();
app.use(bodyParse.json());
app.use(express.static('public'));
app.use(cors());

const empoyeeRoutes = require('./routes/employees');
const jobRoutes = require('./routes/jobs');
const conferenceRoutes = require('./routes/conferenceRooms');
const timeRoutes = require('./routes/times');

app.use('/api/v1/employees', empoyeeRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/conference', conferenceRoutes);
app.use('/api/v1/time', timeRoutes);

const conn = mongoose.createConnection(
  process.env.DB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  },
  () => {
    console.log('connected to DB');
  }
);
conn.once('open', () => {
  gfs = GridFsStream(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

app.get('/api/v1/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  });
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/calendar', (req, res) => {
  res.sendFile(path.join(__dirname + '/calendar.html'));
});
app.get('/employees', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/employees.html'));
});
app.get('/add-employee', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/add_employee.html'));
});
app.get('/edit-employee/:id', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/edit_employee.html'));
});
app.get('/job-positions', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/job_positions.html'));
});
app.get('/add-position', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/add_edit_position.html'));
});
app.get('/edit-position/:id', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/add_edit_position.html'));
});
app.listen('8000', (req,res) => {
  console.log("Server started")
});
