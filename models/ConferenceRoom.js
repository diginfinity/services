const mongoose = require('mongoose');

let conn = mongoose.createConnection(
    process.env.DB_CONNECTION, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true
    });

const ConferenceRoomSchema = mongoose.Schema({
    state: Boolean,
    roomType: String,
    roomLayout: {
        layout: String,
        persons: {
            lecturersMax: Number,
            guestsMax: Number
        }
    },
    time_from: Date,
    time_to: Date,
    date_from: Date,
    date_to: Date,
    contact: {
        name: String,
        phone: Number,
        email: {
            type: String, 
            lowercase: true, 
            unique: true, 
            required: [true, "can't be blank"], 
            match: [/\S+@\S+\.\S+/, 'is invalid'], 
            index: true},
    },
    personnel: {
        reception: {
            isChosen: {
                type: Boolean,
                default: false
            },
            price: Number
        },
        techSupport: {
            isChosen: {
                type: Boolean,
                default: false
            },
            price: Number
        }
    },
    additionalInfo: String,
    total: Number
})

module.exports = conn.model('ConferenceRooms', ConferenceRoomSchema);