import mysql from 'mysql2';
import dotenv from 'dotenv'

dotenv.config()

const db = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})
console.log("hi")
console.log(process.env.DB_USER)

db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL: ' + err.stack);
      return;
    }
    else {
        console.log('Connected to MySQL');
    }
  });

export default db