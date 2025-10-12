const JobOpeningmodal = require("../Model/JobOpening");
const catchAsync = require('../Utill/catchAsync');

exports.JobPost = catchAsync(async (req, res) => {
    try {
        const { email, name, position, phone_number, city } = req.body;

        console.log(req.file)
        if (!email || !name || !position || !phone_number) {
            return res.status(400).json({
                status: false,
                message: "All fields (email, name,  position,resume, phone_number) are required.",
            });
        }
        const record = new JobOpeningmodal({
            email, name, position, resume: req.file.location, phone_number, city
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
        // logger.error(error);
        res.status(500).json({
            msg: "Failed to send Contact",
            error: error.message,
        });
    }
});

exports.JobGet = catchAsync(async (req, res, next) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit) || 50, 1);
        const skip = (page - 1) * limit;
        let query = {};
        const totalJobOpeningmodal = await JobOpeningmodal.countDocuments(query);
        const contactget = await JobOpeningmodal.find(query).sort({ created_at: -1 })
            .skip(skip)
            .limit(limit);
        const totalPages = Math.ceil(totalJobOpeningmodal / limit);

        res.status(200).json({
            data: {
                contactget: contactget,
                totalJobOpeningmodal: totalJobOpeningmodal,
                totalPages: totalPages,
                currentPage: page,
                perPage: limit,
                nextPage: page < totalPages ? page + 1 : null,
                previousPage: page > 1 ? page - 1 : null,
            },
            msg: "Job Opening Get",
        });
    } catch (error) {
        // logger.error(error);
        res.status(500).json({
            msg: "Failed to fetch Contact get",
            error: error.message,
        });
    }
});
