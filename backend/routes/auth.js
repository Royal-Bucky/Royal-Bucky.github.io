//Student/Admin Login and nodemailer
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const otpStorage = {};
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	}
});

//Accept
router.post('/login', (req,res) => {
	const {username, password, role} = req.body;

	if(!username || !password || !role) {
		return res.status(400).json({ error: 'Missing fields' });
	}
	const table = role === 'admin' ? 'admins' : 'students';
	const idField = role === 'admin' ? 'username' : 'roll_no';

	const query = `SELECT * FROM ${table} WHERE ${idField} = ?`;

	db.get(query, [username], async (err,user) => {
		if (err) return res.status(500).json({error: 'Database Error'});
		if (!user) return res.status(401).json({error: 'User Not Found'});

		//Validate
		const match = await bcrypt.compare(password, user.password_hash);
		if (!match) return res.status(401).json({error: 'Invalid password'});
		//Generate OTP
		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		otpStorage[user.email] = {otp,role};
		//Send OTP to mail
		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: user.email,
			subject: 'Login OTP Verification',
			text: `Your OTP is: ${otp}`
		};
		transporter.sendMail(mailOptions, (err, info) => {
			if(err) {
				console.error('Emailing Failed', err);
				return res.status(500).json({error: 'Email Failed'});
			}
			res.json({success: true, message: 'OTP sent', email:user.email});
		});
	});
});

router.post('/verify-otp', (req, res) => {
	const {email, otp} = req.body;
	if(!otp || !email) return res.status(400).json({error: 'Missing fields'});
	const record = otpStorage[email];
	if(!record) return res.status(401).json({error: 'No OTP issued'});
	if(record.otp === otp){
		delete otpStorage[email];
		res.json({success: true, role: record.role});
	} else {
		res.status(401).json({error: 'Invalid OTP'});
	}
});

module.exports = router;
