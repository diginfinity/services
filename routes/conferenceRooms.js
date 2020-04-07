const express = require("express");
const ConferenceRoom = require("../models/ConferenceRoom");
const Time = require("../models/Time");

const router = express.Router();
const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars')

router.post('/reserve', async (req, res) => {
    const { state, roomType, roomLayout, time_from, time_to, date_from, date_to, contact, personnel, additionalInfo, total } = req.body
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
    let month = reservation.date_from.getMonth()
    let day = reservation.date_from.getDay()
    timeToReserve = (reservation.time_to.getHours() - reservation.time_from.getHours()) + 1
    const savedReservation = await reservation.save();

    let transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USER || 'dcde4be7e8cd65',
            pass: process.env.MAIL_PASSWORD || '3221c056f7af02'
        }
      });
      transporter.use('compile',hbs({
        viewEngine: {
            extName: '.hbs',
            partialsDir: 'views/email',
            layoutsDir: 'views/email',
            defaultLayout: 'mail.hbs',
        },
        viewPath: 'views/email',
        extName: '.hbs'
      }))
    
      let info = await transporter.sendMail({
        from: '"Digital Infinity" <office@digitalinfinity.rs>', 
        to: savedReservation.contact.email,
        subject: "Rezervacija prostora",
        text: "Dobrodosli", 
        template: "mail",
        context:{
            year: new Date().getFullYear(),
        }
      });
    
    res.send(savedReservation)
})

module.exports = router;
