const express = require('express');
const Job = require('../models/Job')

const router = express.Router();

router.get('/all-job-positions', async (req, res) => {
    const jobs = await Job.find()
    res.json(jobs)
})

router.post('/open-job-position', async (req, res) => {
    const { title, short, type, workingHours, description} = req.body
    const job = new Job({
        title,
        short,
        type,
        workingHours,
        description
    });
    try{
        const savedJob = await job.save();
        res.json(savedJob)
    } catch (err){
        res.json({ message: err })
    }
})
router.patch('/update-job-position', async (req,res) => {
    const { id, title, short, type, workingHours, description } = req.body
    try{
        const job = await Job.findByIdAndUpdate(id,
        {
            title,
            short,
            type,
            workingHours,
            description
        })
        res.json({message: "Job successfully updated!", job})
    } catch (err){
        res.json({message: err})
    }
})

module.exports = router;