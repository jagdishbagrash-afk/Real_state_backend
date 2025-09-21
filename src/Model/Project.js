

const mongoose = require("mongoose")

const ProjectModel = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    client: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    Image: {
        type: Array,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

const ProjectModels = mongoose.model("projects", ProjectModel);
module.exports = ProjectModels;