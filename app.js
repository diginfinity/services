const express = require('express');
const mongoose = require('mongoose');
const bodyParse = require('body-parser');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const GridFsStream = require('gridfs-stream');
const methodsOverride = require('method-override');
const path = require('path');

require('dotenv/config');

const app = express();
app.use(bodyParse.json());
app.use(express.static('public'));

let gfs;

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
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/dashboard/dashboard.html'));
});
app.listen(8000);
