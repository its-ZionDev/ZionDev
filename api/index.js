import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/home', (req, res) => {
  res.render('index');
});

app.get('/resume/Tanishq_WebDev_Resume.pdf', (req, res) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.download(
    path.join(__dirname, '../public', 'resume', 'Tanishq_WebDev_Resume.pdf'),
  );
});

app.post('/contact', (req, res) => {
  console.log('Form Data:', req.body);

  const { fName, email, subject, message } = req.body;

  if (!fName || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECEIVER,
    subject: subject,
    text: `Message from ${fName} with email address: ${email}\n\n${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred:', error);
      return res
        .status(500)
        .json({ message: 'Error sending email: ' + error.toString() });
    }
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Email sent successfully' });
  });
});

// Export the app
export default app;
