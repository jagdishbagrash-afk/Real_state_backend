const contactmodal = require("../Model/Contact");
const catchAsync = require('../Utill/catchAsync');
const logger = require("../Utill/Logger");

const nodemailer = require("nodemailer");

exports.ContactPost = catchAsync(async (req, res) => {
    try {
        const { email, name, message, services, phone_number } = req.body;

        if (!email || !name || !message || !services || !phone_number) {
            logger.warn("All fields (email, name, message, services, phone_number) are required.");
            return res.status(400).json({
                status: false,
                message: "All fields (email, name, message, services, phone_number) are required.",
            });
        }

        // Save to DB
        const record = new contactmodal({ email, name, message, services, phone_number });
        const result = await record.save();

        if (result) {
            // 🔹 Step 3: Setup Nodemailer Transport
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com", // या आपका SMTP server
                port: 587,
                secure: false, // true for 465, false for 587
                auth: {
                    user: process.env.EMAIL_USER, // ✅ env में रखो
                    pass: process.env.EMAIL_PASS, // ✅ env में रखो
                },
            });

            // 🔹 Step 4: Send Mail
            await transporter.sendMail({
                from: `"My Website" <${process.env.EMAIL_USER}>`,
                to: email, // User को confirmation mail
                subject: "Thank You for Contacting Us!",
                html: `
                  <h2>Hello ${name},</h2>
                  <p>Thank you for contacting us. Here are your details:</p>
                  <ul>
                    <li><b>Email:</b> ${email}</li>
                    <li><b>Phone:</b> ${phone_number}</li>
                    <li><b>Service:</b> ${services}</li>
                    <li><b>Message:</b> ${message}</li>
                  </ul>
                  <p>We will get back to you shortly.</p>
                  <br/>
                  <p>Best Regards,<br/>My Website Team</p>
                `,
            });

            // 🔹 Optional: Admin को भी mail
            await transporter.sendMail({
                from: `"My Website" <${process.env.EMAIL_USER}>`,
                to: "admin@yourdomain.com", // अपना email डालना
                subject: "New Contact Request",
                html: `
                  <h2>New Contact Request</h2>
                  <ul>
                    <li><b>Name:</b> ${name}</li>
                    <li><b>Email:</b> ${email}</li>
                    <li><b>Phone:</b> ${phone_number}</li>
                    <li><b>Service:</b> ${services}</li>
                    <li><b>Message:</b> ${message}</li>
                  </ul>
                `,
            });

            res.json({
                status: true,
                message: "Thank You – Your Request Has Been Successfully Submitted & Email Sent",
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
