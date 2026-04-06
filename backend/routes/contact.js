const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// SEND CONTACT EMAIL
router.post('/', async (req, res) => {
    try {
        const { fname, lname, email, phone, cities, message } = req.body;

        if (!fname || !email || !message) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        // Email to admin
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `New Inquiry from ${fname} ${lname}`,
            html: `
                <h2>New Travel Inquiry — Rajasthan Dekho</h2>
                <p><b>Name:</b> ${fname} ${lname}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Phone:</b> ${phone || 'Not provided'}</p>
                <p><b>City:</b> ${cities || 'Not selected'}</p>
                <p><b>Message:</b> ${message}</p>
            `
        });

        // Confirmation email to user
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'We received your inquiry — Rajasthan Dekho',
            html: `
                <h2>Namaste ${fname}! 🙏</h2>
                <p>Thank you for reaching out to Rajasthan Dekho.</p>
                <p>We have received your inquiry and will get back to you within 24 hours with a custom itinerary.</p>
                <br>
                <p>— Team Rajasthan Dekho</p>
            `
        });

        res.json({ success: true, message: 'Inquiry sent successfully!' });

    } catch (err) {
        res.status(500).json({ message: 'Email sending failed', error: err.message });
    }
});

module.exports = router;