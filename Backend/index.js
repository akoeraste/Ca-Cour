const express=require("express")
const mongoose=require("mongoose")
const Pool=require("pg")
const dotenv=require("dotenv").config()
const app=express()
const bcrypt = require("bcrypt")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")

const {rdbmsDB,pool}=require("./dbconfigs/cockroachdb")
const konnectDB=require("./dbconfigs/mongodb")
const otpMailerBot= require("./services/otpMailer")
const Otp = require("./src/model/otpDB")

// app.use(express.json())
rdbmsDB()
konnectDB()
PORT= process.env.port || 5000
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
const corsOptions = {
  origin: "*", // Add your frontend URLs here
  methods:["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors({corsOptions}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({ msg: "Something went wrong", error: err.message });
});

//signup api
app.post("/signup-email",async(req,res)=>{
try {
    const {email}=req.body
    //console.log("Request body:", req.body);
    if(!email){
        return res.status(400).json({msg:"Please fill missing field"})
        };

    const valideEmail= /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!valideEmail.test(email)){
        return res.status(400).json({msg:"Please enter a valid email format"})
        }
    let idextract
    const existingUser= await pool.query(`SELECT user_id FROM users WHERE email = $1`, [email])
    const verifiedUser = await pool.query(`SELECT * FROM user_verifications WHERE user_id = $1 AND verification_status = 'verified'`, [existingUser.rows[0]?.user_id]);
    if(verifiedUser.rows.length > 0){
        return res.status(400).json({msg:"User with this email already exists"})
    }
    if(existingUser.rows.length === 0){
        await pool.query(`INSERT INTO users (email) VALUES ($1)`, [email])

        const newUserid = await pool.query(`SELECT user_id FROM users WHERE email = $1`, [email])
        idextract = newUserid.rows[0].user_id;

        const updateVerificationID = await pool.query(`INSERT INTO user_verifications (user_id,verification_type,verification_status) VALUES ($1,$2,$3)`, [idextract,'email','pending'])
    }else{
        idextract = existingUser.rows[0].user_id;}

    const vrificationDB= await pool.query(`SELECT * FROM user_verifications WHERE user_id = $1 AND verification_status = 'pending'`, [idextract])
    // console.log("db user:", vrificationDB);
    if(vrificationDB.rows.length > 0){
        const generateOTpw= function(){
        return  Math.floor(100000+Math.random()*90000)};
        //console.log("OTP:",generateOTpw())
        const otp = generateOTpw();
        const strOTP= otp.toString();
        const OTPHash = await bcrypt.hash(strOTP, 10);
        const checkMail = await Otp.findOne({ email: email });
        console.log("Check mail:", checkMail);
        const mailResponse = await otpMailerBot(email, strOTP);
        if (checkMail) {
            checkMail.otp = OTPHash;
            await checkMail.save();
            //console.log("OTP updated successfully");
            }else {
            const saveOtp = await Otp.create({
            email: email,
            otp: OTPHash})};
          }
          const signupTkn = await jwt.sign({email},process.env.userVARToken,{expiresIn:"10m"});
    res.status(200).json({
      msg:"Successful",
      token: signupTkn
    })
    } catch (err) {
        return res.status(400).json({msg: err.message})
    }
});

app.post("/verify-otp-signup", async (req, res) => {
  try {
    const {otp } = req.body;
    const token= req.headers.authorization;
    //console.log("Request body:", req.body);
    const splitToken = token.split(" ")[1];
    //console.log("Split token:", splitToken);

    if (!otp || !token) {
      return res.status(400).json({ msg: "OTP or token is missing" });
    }
    const decodedToken = jwt.verify(splitToken, process.env.userVARToken);
    if (!decodedToken) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }
    const email = decodedToken.email;
    //console.log("Decoded email:", email);
    const authOtp = await Otp.findOne({ email: email });
    const otpExtract = authOtp.otp;
    const isOtpValid = await bcrypt.compare(otp, otpExtract);
    if (!isOtpValid) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }
    
    const existingUser= await pool.query(`SELECT user_id FROM users WHERE email = $1`, [email])
    const idextract= existingUser.rows[0].user_id;
    const vrificationDB= await pool.query(`SELECT * FROM user_verifications WHERE user_id = $1 AND verification_status = 'pending'`, [idextract])
    if(vrificationDB.rows.length > 0){
        const updateVerification = await pool.query(`UPDATE user_verifications SET verification_status = 'verified' WHERE user_id = $1 `, [idextract])
        //console.log("Verification updated successfully");
        }
        const activeToken = jwt.sign(
        {email},
        process.env.userVARToken);
    return res.status(200).json({
      msg: "Successful",
      token: activeToken
    });
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }  
});


app.post("/signup-fulldetails",async(req,res)=>{
    try {
        const {username,first_name,last_name,phone_number,password,location,refcode}=req.body
        const token= req.headers.authorization;
        //console.log("Request body:", req.body);
        const splitToken = token.split(" ")[1];
        //console.log("Split token:", splitToken);
        if(!username || !phone_number || !password  || !first_name || !last_name || !location){
            return res.status(400).json({msg:"Please fill all the fields"})
        };
        if(phone_number.length >= 10){
        const validePhoneNumber = /^\d{10,}$/;
        if(!validePhoneNumber.test(phone_number)){
            return res.status(400).json({msg:"Please enter a valid phone number"})
        }
                
        const last10Digits =phone_number.slice(-10)
        console.log("phone Number:",last10Digits)
        const existingUser= await pool.query(`SELECT * FROM users WHERE phone_number = $1`, [last10Digits])
        if(existingUser.rows.length > 0){
            return res.status(400).json({msg:"User with this mobile number already exists"})
        }
        const country=location.country
        const region=location.region
        const city=location.city
        const address_line=location.address_line
        const postal_code=location.postal_code
        const longitude=location.longitude
        const latitude=location.latitude

        await pool.query(`INSERT INTO countries (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`, [country])
        const countryId = await pool.query(`SELECT country_id FROM countries WHERE name = $1`, [country])
        const country_id = countryId.rows[0].country_id;
        
        await pool.query(`INSERT INTO regions (name,country_id) VALUES ($1,$2)`, [region,country_id])
        const regionId = await pool.query(`SELECT region_id FROM regions WHERE name = $1 AND country_id = $2`, [region,country_id])
        const region_id = regionId.rows[0].region_id;

        await pool.query(`INSERT INTO cities (name,region_id) VALUES ($1,$2)`, [city,region_id])
        const cityId = await pool.query(`SELECT city_id FROM cities WHERE name = $1 AND region_id = $2`, [city,region_id])
        const city_id = cityId.rows[0].city_id;

        await pool.query(`INSERT INTO locations (city_id,address_line,postal_code,latitude,longitude) VALUES ($1,$2,$3,$4,$5)`, [city_id,address_line,postal_code,latitude,longitude])
        const locationId = await pool.query(`SELECT location_id FROM locations WHERE city_id = $1 AND address_line = $2 AND postal_code = $3 AND latitude = $4 AND longitude = $5`, [city_id,address_line,postal_code,latitude,longitude])
        const location_id = locationId.rows[0].location_id;

        const genrefcode = function() {
            return Math.floor(1000 + Math.random() * 9999);
        }

        const decodedToken = await jwt.verify(splitToken, process.env.userVARToken);
        console.log("Decoded token:", decodedToken);
        if (!decodedToken) {
            return res.status(400).json({ msg: "Invalid Token" })}
        const email = decodedToken.email;
        const existingID = await pool.query(`SELECT user_id FROM users WHERE email = $1`, [email])
        const idextract = existingID.rows[0].user_id;
        const hashedPassword = await bcrypt.hash(password, 10)

        await pool.query(`UPDATE users SET username = $1,phone_number = $2, password_hash = $3 WHERE user_id = $4`,[username,last10Digits,hashedPassword,idextract])
        await pool.query(`INSERT INTO user_profiles (user_id,first_name,last_name,location_id) VALUES ($1,$2,$3,$4)`,[idextract,first_name,last_name,location_id])
        const userProfile= await pool.query(`SELECT * FROM user_profiles WHERE user_id = $1`, [idextract])

        const userRefCode = `ca-cour-${genrefcode()}`;
        console.log("User Referral Code:", userRefCode);
        await pool.query(`insert into referrals(referrer_id,referral_code) values($1,$2)`,[idextract,userRefCode])
        const reftableID = await pool.query(`SELECT referral_table_id FROM referrals WHERE referrer_id = $1 AND referral_code = $2`, [idextract,userRefCode])
        const referral_id = reftableID.rows[0].referral_table_id;
        if(refcode){
            const refUser = await pool.query(`SELECT referrer_id FROM referrals WHERE referral_code = $1`, [refcode])
            if(refUser.rows.length > 0){
                const referrerId = refUser.rows[0].referrer_id;
                await pool.query(`INSERT INTO referrals (referrer_id,referred_id) VALUES ($1,$2)`, [referrerId, referral_id])
            }else{
                return res.status(400).json({msg:"Invalid referral code"})
            }
        }

        return res.status(201).json({msg:"SUCCESSFUL",user: userProfile.rows[0]})
        }else {
            return res.status(400).json({msg:"Please enter a valid phone number"})
        }

    } catch (err) {
        return res.status(400).json({msg: err.message})
    }
});


//login api
app.post("/login", async (req, res) => {
  try {
    const { login_details, password } = req.body;
    if (!login_details || !password) {
      return res.status(400).json({ msg: "Please fill all the fields" }); 
    }
    let phone_number;
    let email;
    let username;

    if(login_details.match(/^\d{10,}$/)) {
      // If login_details is a phone number
      if (login_details.length < 10) {
        return res.status(400).json({ msg: "Phone number length must be at least 10 digits" });
      }
    phone_number = login_details
    const last10Digits = phone_number.slice(-10);
    const user = await pool.query(`SELECT * FROM users WHERE phone_number = $1`, [last10Digits]);
    if (user.rows.length === 0) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Invalid password" });
    }
      const activeToken = jwt.sign(
      { userId: user.rows[0].user_id},
      process.env.activeTk,
      { expiresIn: "1hr" }
    );
    console.log("user:", user.rows[0].user_id);
    return res.status(200).json({
      msg: "Login successful",
      token: activeToken
    });
    }
    else if (login_details.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      // If login_details is an email
      email = login_details;
      const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
      if (user.rows.length === 0) {
        return res.status(400).json({ msg: "User does not exist" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.rows[0].password_hash);
      if (!isPasswordValid) {
        return res.status(400).json({ msg: "Invalid password" });
      }
      const activeToken = jwt.sign(
        { userId: user.rows[0].user_id },
        process.env.activeTk,
        { expiresIn: "1hr" }
      );
      console.log("user:", user.rows[0].user_id);
      return res.status(200).json({
        msg: "Login successful",
        token: activeToken
      });
    } else if (login_details.match(/^[a-zA-Z0-9_]{3,}$/)) {
      // If login_details is a username
      username = login_details;
      const user = await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
      if (user.rows.length === 0) {
        return res.status(400).json({ msg: "User does not exist" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.rows[0].password_hash);
      if (!isPasswordValid) {
        return res.status(400).json({ msg: "Invalid password" });
      }
      const activeToken = jwt.sign(
        { userId: user.rows[0].user_id },
        process.env.activeTk,
        { expiresIn: "1hr" }
      );
      console.log("user:", user.rows[0].user_id);
      return res.status(200).json({
        msg: "Login successful",
        token: activeToken
      });
    } else {
      return res.status(400).json({ msg: "Invalid login details format" });
    }
  
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

//Get all users-ADMIN
app.get("/allUsers", async (req, res) => {
  try {
    const users = await pool.query(`SELECT * FROM users`);
    return res.status(200).json({ 
      msg: "Users fetched successfully",
      users: users.rows,
      count: users.rowCount});
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

//create seller profile
app.post("/create-seller",(req,res)=>{
  try {
    const{bussiness_name, description} = req.body;
    const token = req.headers.authorization;
    const splitToken = token.split(" ")[1];
    const decoded = jwt.verify(splitToken, process.env.activeTk);
    const userId = decoded.userId;

  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
})