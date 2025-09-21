

const mongoose = require("mongoose")

const PortFoilo = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
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
})

const Contact = mongoose.model("Port", PortFoilo);
module.exports = Contact;