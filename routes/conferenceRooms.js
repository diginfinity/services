const express = require('express');
const ConferenceRoom = require('../models/ConferenceRoom')
const Time = require('../models/Time')

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

    for(i=reservation.time_from.getHours()-1; i<(reservation.time_from.getHours()-1) +timeToReserve; i++){
        test.push(i)
    }
    const times = await Time.find({},(err,result) => {
        if(reservation.date_from.getTime() === reservation.date_to.getTime()){
            result[0].years[month].month.value[day].value.forEach(item => {
                test.forEach(h => {
                    if(h === item.hour) {
                        // Time.updateMany({},{$set:{"years[0].month.value[month].value[day]": 1001}})
                        result[0].years[month].month.value[day].value[h].hour = 1001
                    }
                }) 
            }) 
            result[0].save()
        }else {
            let i = reservation.date_from.getMonth();
            while (i <= reservation.date_to.getMonth() ) {
                result[0].years[i].month.value.forEach(day => {
                    day.value.forEach(item => {
                        test.forEach(h => {
                            if(h === item.hour) {
                                item.hour = 1001
                            }
                        }) 
                    })
                }) 
                i++
            }
            result[0].save()
        }
    })
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