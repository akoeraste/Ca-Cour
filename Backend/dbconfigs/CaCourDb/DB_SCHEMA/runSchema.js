// const fs=require("fs")
// const path=require("path")
// const {Pool}=require("pg")
// const dotenv=require("dotenv").config()
// const pool= new Pool({
//     connectionString: process.env.rdbmskonekt,
//         ssl:{
//             rejectUnauthorized: true,
//             ca: fs.readFileSync(path.resolve(__dirname, "../root.crt")).toString(), // Adjust the path to your CA certificate
    
//         }
// })

// const files=['messages.sql']


// const runSchema=async(res)=>{
//     try{
//         for(const file of files){
//             const filePath=path.join(__dirname,'Communication Module',file);
//             const sql=fs.readFileSync(filePath,'utf-8')
//             console.log(`Running schema from ${file}`)
//             await pool.query(sql)
//         }
//         console.log("Schema run successfully")
//     }catch(err){
//         console.log({msg:err.message})
//     }finally{
//         await pool.end()
//     }
// };

// runSchema()

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
    await pool.query(`ALTER TABLE users ALTER COLUMN status SET DEFAULT 'active';`)
        console.log("Operation successfully")
}catch (err) {
    console.log("Error:", err.message);
  } finally {
    await pool.end()
  }}
alter_Col()