//sqlite3 connection
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const data = path.resolve(__dirname, 'data', 'student.db');
const db = new sqlite3.Database(data, (err) => {
	if(err) {
		console.error('Failed to connect to databse:', err.message);
	}
	else {
		console.log('Successfully connected to Database');
	}
});

module.exports=db;