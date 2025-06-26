const {Pool}=require("pg")
const dotenv=require("dotenv")
const fs=require("fs")
const path=require("path")

const pool= new Pool({
    connectionString: process.env.rdbmskonekt,
    ssl:{
        rejectUnauthorized: true,
        ca: fs.readFileSync(path.resolve(__dirname, "../root.crt")).toString(), // Adjust the path to your CA certificate

    }
})

const rdbmsDB= async()=>{
    try{
        await pool.connect()
        .then(()=>{
            console.log("RDBMS CONNECTED")
        })
    }catch(err){
        //return res.status(500).json({msg:err.message})
        console.log("RDBMS CONNECTION ERROR",err)
    }
}

module.exports={rdbmsDB,pool}