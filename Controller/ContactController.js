const contactmodal = require("../Model/Contact");
const catchAsync = require('../Utill/catchAsync');
const logger = require("../Utill/Logger");
const emailTemplate = require("../contactemail")
const nodemailer = require("nodemailer");

exports.ContactPost = catchAsync(async (req, res) => {
    try {
        const { email, name, message, services, phone_number } = req.body;

        if (!email || !name || !message || !services || !phone_number) {
            return res.status(400).json({
                status: false,
                message: "All fields (email, name, message, services, phone_number) are required.",
            });
        }

        // Save to DB
        const record = new contactmodal({ email, name, message, services, phone_number });
        const result = await record.save();

        if (!result) {
            return res.status(500).json({
                status: false,
                message: "Failed to save contact details.",
            });
        }

        // Nodemailer Transport
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // 1️⃣ Send Confirmation to User
        await transporter.sendMail({
            from: `"Cadmaxpro " <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Thank You for Contacting Cadmaxpro! 🌟",
            html: emailTemplate({ name, email, phone_number, services, message, isUser: true }),
        });

        // 2️⃣ Send Notification to Admin
        await transporter.sendMail({
            from: `"Cadmaxpro Website" <${process.env.EMAIL_USER}>`,
            to: "ankitkumarjain0748@gmail.com", 
            subject: "📩 New Contact Request",
            html: emailTemplate({ name, email, phone_number, services, message }),
        });

        res.json({
            status: true,
            message: " Request submitted & emails sent successfully.",
        });

    } catch (error) {
        logger.error(error);
        res.status(500).json({
            status: false,
            message: "❌ Failed to send contact request.",
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
