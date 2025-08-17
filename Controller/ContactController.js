const contactmodal = require("../Model/Contact");
const catchAsync = require('../Utill/catchAsync');
const logger = require("../Utill/Logger");

exports.ContactPost = catchAsync(async (req, res) => {
    try {
        const { email, name, message, services, phone_number } = req.body;

        if (!email || !name || !message || !services || !phone_number) {
            logger.warn("All fields (email, name, message, services, phone_number) are required.")
            return res.status(400).json({
                status: false,
                message: "All fields (email, name, message, services, phone_number) are required.",
            });
        }
        const record = new contactmodal({
            email, name, message, services, phone_number
        });

        const result = await record.save();
        if (result) {
            res.json({
                status: true,
                message: "Thank You – Your Request Has Been Successfully Submitted",
            });
        } else {
            res.json({
                status: false,
                error: result,
                message: "Failed to Contact.",
            });
        }
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            msg: "Failed to send Contact",
            error: error.message,
        });
    }
});

exports.ContactGet = catchAsync(async (req, res, next) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit) || 50, 1);
        const skip = (page - 1) * limit;
        let query = {};
        const totalcontactmodal = await contactmodal.countDocuments(query);
        const contactget = await contactmodal.find(query).sort({ created_at: -1 })
            .skip(skip)
            .limit(limit);
        const totalPages = Math.ceil(totalcontactmodal / limit);

        res.status(200).json({
            data: {
                contactget: contactget,
                totalcontactmodal: totalcontactmodal,
                totalPages: totalPages,
                currentPage: page,
                perPage: limit,
                nextPage: page < totalPages ? page + 1 : null,
                previousPage: page > 1 ? page - 1 : null,
            },
            msg: "Contact Get",
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            msg: "Failed to fetch Contact get",
            error: error.message,
        });
    }
});
