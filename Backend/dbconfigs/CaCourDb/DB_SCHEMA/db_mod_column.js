const {Pool}=require("pg")
const dotenv=require("dotenv").config()
const fs=require("fs")
const path=require("path")

const pool= new Pool({
    connectionString:process.env.rdbmskonekt,
        ssl:{
            rejectUnauthorized: true,
            ca: fs.readFileSync(path.resolve(__dirname, "../root.crt")).toString(), // Adjust the path to your CA certificate
    
        }
})


const alter_Col=async()=>{
    try {
    await pool.query(`ALTER TABLE deliveries ADD COLUMN order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE;`)
        console.log("Column renamed successfully")
}catch (err) {
    console.log("Error:", err.message);
  } finally {
    await pool.end()
  }}
alter_Col()
// const alter_Col=async()=>{
//     try {
//     await pool.query(`ALTER TABLE orders
//         ADD COLUMN IF NOT EXISTS delivery_id UUID NOT NULL REFERENCES deliveries(delivery_id)`)
//         console.log("Column renamed successfully")
// }catch (err) {
//     console.log("Error:", err.message);
//   } finally {
//     await pool.end()
//   }}
// alter_Col()