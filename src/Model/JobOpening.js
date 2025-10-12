

const mongoose = require("mongoose")

const JobSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true
    },
    phone_number: {
        type: Number,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    resume :{
        type: String,
    }
})

const Contact = mongoose.model("carrers", JobSchema);
module.exports = Contact;