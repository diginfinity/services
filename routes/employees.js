const express = require('express');
const Employee = require('../models/Employee');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');

const router = express.Router();

router.get('/all-employees', async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
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
