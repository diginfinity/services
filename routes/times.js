const express = require('express');
const Time = require('../models/Time')
const router = express.Router();

let numberOfHours = []
for(i=0; i<24; i++){
    numberOfHours.push({hour:i})
}
let numberOfDays = []
for(i=1; i<=31; i++){
    numberOfDays.push({
    name : i,
    value : numberOfHours})
}
let numberOfMonths = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
let newMonth = []
for(i=0; i<12; i++){
    newMonth.push({
    month:{name: numberOfMonths[i],
    value: numberOfDays}})
}

router.post('/addCalendar', (req, res) => {
    const time = new Time({
        years: newMonth 
    });
    time.save()
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        console.log(err)
    })

})


module.exports = router;