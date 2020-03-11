const mongoose = require('mongoose');
let conn = mongoose.createConnection(
    process.env.DB_CONNECTION, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true
    });
const JobsSchema = mongoose.Schema({
    title: String,
    short: String,
    type: String,
    workingHours: Number,
    description: String
})

module.exports = conn.model('Jobs', JobsSchema);