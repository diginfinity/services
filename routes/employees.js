const express = require('express');
const Employee = require('../models/Employee');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');

const router = express.Router();

router.get('/all-employees', async (req, res) => {
  try{
    const employees = await Employee.find();
    res.json(employees);
  }catch(err){
    res.status(404).json(err)
  }
});

router.get('/:id', async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  res.json(employee);
});

router.put('/:id', (req, res) => {
  var employee = req.body;

  Employee.findByIdAndUpdate(req.params.id, { $set: employee }, async function(
    err,
    result
  ) {
    if (err) {
      console.log(err);
    }
    const response = await Employee.findById(req.params.id);
    res.send(response);
  });
});

router.delete('/:id', async (req, res) => {
  Employee.findByIdAndRemove(req.params.id, function(err) {
    if (err) res.send(err);
    else res.json({ message: 'Employee deleted!' });
  });
});

router.post('/addEmployee', (req, res) => {
  const employee = new Employee({
    name: req.body.name,
    position: req.body.position,
    linkedIn: req.body.linkedIn
  });

  employee
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
});
const storage = new GridFsStorage({
  url: process.env.DB_CONNECTION,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

router.post('/uploadImage', upload.single('file'), (req, res) => {
  const image = req.file.filename;
  Employee.findByIdAndUpdate(
    req.query.id,
    { imageId: image },
    (err, employee) => {
      res.json(employee);
    }
  );
});

module.exports = router;
