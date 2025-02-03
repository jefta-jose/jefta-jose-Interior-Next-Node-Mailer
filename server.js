const express = require("express");
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const dotenv = require('dotenv');

const app = express();
const PORT = 5000;

app.use(cors({
    origin: "http://localhost:3000",  // Allow requests from your Vite app's URL
  }));

app.use(bodyParser.json());
dotenv.config();

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Endpoint to handle contact form submissions
app.post("/send-email", async (req, res) => {
    const { firstname, lastname, company, email, message } = req.body;

    // List of recipients
    const recipients = [
        "ndegwajeff4@gmail.com",
        "muthigaerick@gmail.com",
    ];

    // Email content
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipients.join(","), // Send to multiple emails
        subject: "New Contact Form Submission",
        html: `
            <h2>New Inquiry from ${firstname} ${lastname}</h2>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong> ${message}</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});