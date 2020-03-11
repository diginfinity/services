const express = require('express');
const ConferenceRoom = require('../models/ConferenceRoom')
const Time = require('../models/Time')

const router = express.Router();

router.get('/test', async (req,res) => {
    // let month = 2;
    // const r = await Time.find({},(err, response) =>{
    //     // response[0].years[0].month.value[0].value[0].hour = 1011;
    //     // response[0].save()
    //     res.json(response[0].years[0].month.value[0].value[0].hour)
    // })
    // res.json('success')
    // console.log(r)
    // const r = await Time.find({months: })
    // r.months[0].Jan[0] = "burek"
    // r[0].months[0].Jan[0] 
    // res.json(r)

    // ovo radi ! ! !
//    const q = await Time.updateMany({},{$set:{"years.0.month.value.0.value.0.hour": 1000}})
    // res.json(r)
    let today = new Date(1583767682328)
    let lastDay = new Date(1591712968933)
    let l = lastDay.toISOString()
    let n = today.toISOString()

    let i = 2;
    Time.find({}, (err, result) => {
    while (i <= 5) {
        result[0].years.forEach(month => {
            result[0].years[i].month.value.forEach(day => {
                result[0].years[month].month.value[day].value.forEach(item => {
                    
                test.forEach(h => {
                    if(h === item.hour) {
                        // Time.updateMany({},{$set:{"years[0].month.value[month].value[day]": 1001}})
                        result[0].years[month].month.value[day].value[h].hour = 1001
                    }
                }) 
            })
        })
    }) 
        i++
    }
})
})

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
        }/* else {
            let i = reservation.date_from.getTime();
            while (i <= reservation.date_to.getTime()) {
                result[0].years[month].month.value[day].value.forEach(item => {
                    test.forEach(h => {
                        if(h === item.hour) {
                            // Time.updateMany({},{$set:{"years[0].month.value[month].value[day]": 1001}})
                            result[0].years[month].month.value[day].value[h].hour = 1001
                        }
                    }) 
                }) 
                i++
            }
        } */
    })
    const savedReservation = await reservation.save();
    res.json(savedReservation)
    
    // const time = await Time.find({}, (err, result) => {
    // res.json(result[0].years[month].month.value[day].value[hour])
    // })
    
})

router.get('/current-status', async (req, res) => {
    const available = await ConferenceRoom.where('state', false)
    const times = await Time.find()
    let timeToReserve;
    let month = available[0].date_from.getMonth()
    let day = available[0].date_from.getDay()
    let test = []

    timeToReserve = (available[0].time_to.getHours() - available[0].time_from.getHours()) + 1
    for(i=available[0].time_from.getHours()-1; i<(available[0].time_from.getHours()-1) +timeToReserve; i++){
        test.push(i)
    }
   
    times[0].year[month][day].forEach(hour => {
        test.forEach(h => {
            if(h === hour) {
                times[0].year[month][day][hour] = 'reserved'
            }
        })
    })
    res.json(times[0].year[month][day])

})

module.exports = router;