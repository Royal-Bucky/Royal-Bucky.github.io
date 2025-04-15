const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db');

router.post('/add-student', async (req,res) => {
    const { name, roll_no, email, branch, year, password } = req.body;
    const query = "INSERT INTO students (name, roll_no, email, branch, year, password_hash) VALUES (?, ?, ?, ?, ?, ?);";
    const password_hash = await bcrypt.hash(password, 10);

    db.run(query, [name, roll_no, email, branch, year, password_hash], function(err) {
        if (err) {
            console.error('Database error: ', err.message);
            return res.status(500).json({error: 'Database error'});
        }
        res.json({success: true});
    });
});

router.put('/edit-student', (req,res) => {
    const { roll_no, name, email, branch, year } = req.body;
    const query = "UPDATE students SET name = ?, email = ?, branch = ?, year = ? WHERE roll_no = ?";

    db.run(query, [name, email, branch, year, roll_no], (err) => {
        if (err) return res.status(500).json({error: 'Database Error'});
        res.json({success : true});
    });
});

router.delete('/delete-student', (req,res) => {
    const {roll_no} = req.body;
    const query = "DELETE FROM students WHERE roll_no = ?";

    db.run(query, [roll_no], (err) => {
        if (err) return res.status(500).json({error: 'Database error'});
        res.json({success:true});
    });
});

router.get('/get-students', (req,res) => {
    const query = "SELECT name, roll_no, email, branch, year FROM students";

    db.all(query, [], (err,rows) => {
        if (err) return res.status(500).json({error: 'Database error'});
        res.json(rows);
    });
});

module.exports = router;