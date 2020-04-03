const express = require("express");
const ConferenceRoom = require("../models/ConferenceRoom");
const Time = require("../models/Time");

const router = express.Router();
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

let user = {
  name: "Uros Teofanovic",
  email: "uteofanovic4@gmail.com"
};

router.post("/test", async (req, res) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "dc76cdf8dbaca4",
      pass: "133e40d0683fd3"
    }
  });
  transporter.use(
    "compile",
    hbs({
      viewEngine: {
        extName: ".hbs",
        partialsDir: "views/email",
        layoutsDir: "views/email",
        defaultLayout: "mail.hbs"
      },
      viewPath: "views/email",
      extName: ".hbs"
    })
  );

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Digital Infinity" <office@digitalinfinity.rs>', // sender address
    to: user.email, // list of receivers
    subject: "Hello ✔", // Subject linesss
    text: "Hello world?", // plain text body
    template: "mail", // html body
    context: {
      year: new Date().getFullYear()
    }
  });

  console.log("Message sent: %s", info.messageId);
  res.send("Email has been sent");
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
});

router.post("/reserve", async (req, res) => {
  const {
    state,
    roomType,
    roomLayout,
    time_from,
    time_to,
    date_from,
    date_to,
    contact,
    personnel,
    additionalInfo,
    total
  } = req.body;
  let timeToReserve;
  let test = [];

  const reservation = new ConferenceRoom({
    state,
    roomType,
    roomLayout,
    time_from,
    time_to,
    date_from,
    date_to,
    contact,
    personnel,
    additionalInfo,
    total
  });
  let month = reservation.date_from.getMonth();
  let day = reservation.date_from.getDay();
  timeToReserve =
    reservation.time_to.getHours() - reservation.time_from.getHours() + 1;

  for (
    i = reservation.time_from.getHours() - 1;
    i < reservation.time_from.getHours() - 1 + timeToReserve;
    i++
  ) {
    test.push(i);
  }
  const times = await Time.find({}, (err, result) => {
    if (reservation.date_from.getTime() === reservation.date_to.getTime()) {
      result[0].years[month].month.value[day].value.forEach((item) => {
        test.forEach((h) => {
          if (h === item.hour) {
            // Time.updateMany({},{$set:{"years[0].month.value[month].value[day]": 1001}})
            result[0].years[month].month.value[day].value[h].hour = 1001;
          }
        });
      });
      result[0].save();
    } else {
      let i = reservation.date_from.getMonth();
      while (i <= reservation.date_to.getMonth()) {
        result[0].years[i].month.value.forEach((day) => {
          day.value.forEach((item) => {
            test.forEach((h) => {
              if (h === item.hour) {
                item.hour = 1001;
              }
            });
          });
        });
        i++;
      }
      result[0].save();
    }
  });
  const savedReservation = await reservation.save();

  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "dcde4be7e8cd65",
      pass: "3221c056f7af02"
    }
  });
  transporter.use(
    "compile",
    hbs({
      viewEngine: {
        extName: ".hbs",
        partialsDir: "views/email",
        layoutsDir: "views/email",
        defaultLayout: "mail.hbs"
      },
      viewPath: "views/email",
      extName: ".hbs"
    })
  );

  let info = await transporter.sendMail({
    from: '"Digital Infinity" <office@digitalinfinity.rs>',
    to: savedReservation.contact.email,
    subject: "Rezervacija prostora",
    text: "Dobrodosli",
    template: "mail",
    context: {
      year: new Date().getFullYear(),
      date: savedReservation.date_from
    }
  });

  //   res.send('Reservation is completed, visit your mail for more details')
  res.send(savedReservation);
  // const time = await Time.find({}, (err, result) => {
  // res.json(result[0].years[month].month.value[day].value[hour])
  // })
});

router.get("/current-status", async (req, res) => {
  const available = await ConferenceRoom.where("state", false);
  const times = await Time.find();
  let timeToReserve;
  let month = available[0].date_from.getMonth();
  let day = available[0].date_from.getDay();
  let test = [];

  timeToReserve =
    available[0].time_to.getHours() - available[0].time_from.getHours() + 1;
  for (
    i = available[0].time_from.getHours() - 1;
    i < available[0].time_from.getHours() - 1 + timeToReserve;
    i++
  ) {
    test.push(i);
  }

  times[0].year[month][day].forEach((hour) => {
    test.forEach((h) => {
      if (h === hour) {
        times[0].year[month][day][hour] = "reserved";
      }
    });
  });
  res.json(times[0].year[month][day]);
});

module.exports = router;
