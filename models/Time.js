const mongoose = require('mongoose')

const conn = mongoose.createConnection(
    process.env.DB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
);


const TimesSchema = mongoose.Schema({
    years: [ {
        month:{
        name: String,
        value: [{
            name: Number,
            value: [ { hour: Number } ]
        }]
    }
    }]
})

module.exports = conn.model('Times', TimesSchema);