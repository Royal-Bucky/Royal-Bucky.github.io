const db = require("../db");
const router = require("./auth");

router.get('/student/details', (req,res) => {
    const email = req.query.email;
    const sql = "SELECT name, roll_no, mobile, email, branch, year FROM students WHERE email = ?";

    db.get(sql,[email], (err,row) => {
        if (err) return res.status(500).json({error: "Database error"});
        if (!row) return res.status(404).json({error: "Student not found"});
        res.json(row);
    });
});

module.exports = router;