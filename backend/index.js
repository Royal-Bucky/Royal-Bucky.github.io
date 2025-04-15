const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const adminRoutes = require('./routes/admin');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use('/api', studentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.get('/', (req,res) => {
	res.send('Student Login System Backend is running.');
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});