

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
    slug: String,
    Image: {
        type: Array,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    client_review: String,
    banner_image: String,
    list_image: String,
    location: String,
    client_name: String,
    status : {
        type: String,
        enum: ['ongoing', 'completed', 'upcoming'],
        default: 'completed'
    }
})

const ProjectModels = mongoose.model("projects", ProjectModel);
module.exports = ProjectModels;