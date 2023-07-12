import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
dotenv.config()

const con = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})

con.getConnection().then(connection => {
  console.log('Database connection estabilished') 
  connection.release()
}).catch(err => {
  if (err.code === 'ECONNREFUSED') {
    console.error('Database connection was refused') 
  }  
})

export default con