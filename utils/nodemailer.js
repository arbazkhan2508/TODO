const nodemailer = require('nodemailer');
const ErorrHandler = require('./ErrorHandling');

exports.sendmail = (req, res, next, reset_link) => {
    console.log(req, "its response");
    const transport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465, // Corrected property name to "port"
        secure: true, // Use secure connection
        auth: {
            user: process.env.MAIL_EMAIL_ADDRESS,
            pass: process.env.MAIL_EMAIL_PASSWORD
        },
    });

    const mailOptions = {
        from: "Asad Khan <ak1933929@gmail.com>",
        to: req.body.email,
        subject: "Password Reset Link",
        html: `<h1>Click Link</h1>
             <a href="${reset_link}">Reset Link</a>
         `
    };

    transport.sendMail(mailOptions, (err, info) => {
        if (err) return next(
            new ErorrHandler(err, 500)
        );
        // console.log(info);
        return res.status(200).json({
            message: "Mail sent successfully",
            reset_link,
        });
    });
}
