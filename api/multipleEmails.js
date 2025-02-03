import nodemailer from 'nodemailer';
const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    return await fn(req, res);
  };
  
const transporter = nodemailer.createTransport({
service: "gmail",
auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
},
});

const handler = async (req, res) => {
    if(req.method === 'POST'){
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
    }

};


export default allowCors(handler);