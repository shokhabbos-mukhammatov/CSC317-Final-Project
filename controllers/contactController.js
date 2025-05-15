const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

// Mailtrap transporter directly in controller
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "ad0b3edb065726",
        pass: "1b5e5b31b085bc"
    }
});

exports.getContactForm = (req, res) => {
    res.render('contactus', {
        title: 'Contact Us',
        errors: [],
        flashMessage: req.session.flashMessage || null
    });
    delete req.session.flashMessage;
};

exports.sendContactMessage = async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).render('contactus', {
            title: 'Contact Us',
            errors: [{ msg: 'All fields are required.' }]
        });
    }

    try {
        const html = await ejs.renderFile(
            path.join(__dirname, '../views/emails/contact.ejs'),
            { name, email, subject, message }
        );

        await transporter.sendMail({
            from: `"${name}" <${email}>`,
            to: 'you@trip-tuner.test', // dummy email, safe to use with Mailtrap
            subject: `[Trip Tuner] ${subject}`,
            html
        });

        req.session.flashMessage = {
            type: 'success',
            text: 'Your message was sent successfully!'
        };
        res.redirect('/contactus');
    } catch (error) {
        console.error('Email send error:', error);
        res.status(500).render('contactus', {
            title: 'Contact Us',
            errors: [{ msg: 'An error occurred while sending your message.' }]
        });
    }
};
