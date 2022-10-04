const express = require('express')
const app = express();
const env  = require('dotenv');
env.config();
const bodyParser = require("body-parser");
const User = require("./models/users");
const Cv = require("./models/cv");
///const cors = require("cors");
const cors = require("cors");
const database = require('./config/database');
const bcrypt = require("bcryptjs");
const cookieparser = require('cookie-parser')
app.use(cookieparser())
const checkLiveOrDead = require('./middlerware/checkLiveOrDead');
const Otp = require('./models/otp');
const multer = require('multer');
const path = require("path")
database.connect();

const IMG_DIR = './public/images/';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, IMG_DIR)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix+path.extname(file.originalname))
    }
  })
  
const uploadImg = multer({ storage: storage })
//app.use(checkLiveOrDead);
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
app.use(express.json())
const corsOptions = {
    credentials: true,
    origin:  ['http://localhost:3000','http://localhost:3001'], // ['http://localhost:3002', 'your-production-domain']
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: true,
    optionsSuccessStatus: 204
    ///..other options
  };
app.use(cors(corsOptions))




// Register
app.post("/register", async (req, res) => {
    // our register logic goes here...

    try{
                      
        const {firstName, lastName, email, password, phoneNumber} = req.body;
        //console.log(req.body)
            

        // validate user input
        if(!(email) && password){
            res.status(400).send("Inputs are required")
        }

        //check if user already exist
        const oldUser = await User.findOne({email})

        if(oldUser){
            return res.status(409).send("User Already Exist");
        }


        const user = await User.create({
            firstName,
            lastName, 
            email,
            password,
            phoneNumber
        })

        /* const token = await user.generateAuthToken();
        res.cookie('authToken', token, { expires: new Date(Date.now() + 900000), httpOnly: true }) */
        /* console.log(token) */

        res.status(201).json(user).save()
        //user.save();
        //res.status(201);
    } catch(err){
        console.log(err)
    }
});
    
// Login
app.post("/login", async (req, res) => {
// our login logic goes here
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email:email});
        if(user){
            

            const isPassword = await bcrypt.compare(password,user.password);

            if( isPassword ){
                const token = await user.generateAuthToken();
                res.cookie('authToken', token, {maxAge: 24 * 60 * 60 * 1000, expires: new Date(Date.now() + 24 * 60 * 60 * 1000), httpOnly: true })
                //console.log(token);
                res.status(201).send(user)
            }

            

            /* if(user.password === password){
                res.status(201).send(user)
            } */
            
        }else{
            res.status(400).send({
                error: "Data Not found"
            })
        }
    }
    catch(err){
        console.log(err)
    }
});

// api to create cv or send data to databse
app.post("/createcv", checkLiveOrDead , uploadImg.single('profileImg'), async (req,res)=>{
    
    let formData = req.body;
    let userStatus = req.userStatus;
    //console.log(req.file)
    
    if( userStatus._id ){
        
        try{
            const cv = await Cv.create({
                userId: userStatus._id,
                data:[formData],
                profileImg:req.file.filename
            })
            res.status(201).json(cv)
        }catch(err){
            console.log(err)
        }
    }
    else{
        res.send()
    }
})

app.post("/uploadcv-image", uploadImg.single('profileImg'), async (req,res)=>{
    const url = req.protocol + '://' + req.get('host');
    //console.log(req.file)
    res.status(201);
    
    /* try{
        const cv = await Cv.create({
            profileImg  : req.profileImg
        })
        res.status(201).json(cv)
        
    }
    catch(err){
        console.log(err)
    } */
})


// update the cv
app.post("/updatecv", checkLiveOrDead,uploadImg.single('profileImg'), async (req,res)=>{
    const formData = req.body;
    let userStatus = req.userStatus;
    const cvid = req.query.cvid;
    //console.log('formdata: ' + formData)
    //console.log('cvid : ' + cvid)

    if( userStatus._id ){
        try{
            const cv = await Cv.updateOne({
                _id:cvid
            },{
                data: formData,
                profileImg:'req.file.filename'

            })
            
            res.status(201).json(cv)
        }catch(err){
            console.log(err)
        }
    }
    else{
        res.send()
    }
})

// to fetch data from cv by filtering user id
app.post('/getcv', checkLiveOrDead, async (req,res)=>{
    const userStatus = req.userStatus;
    const id = userStatus._id;
        if( id ){
            try{
                const cvs = await Cv.find({userId:id});
                //const cvs = await Cv.findById(id);
                //console.log('Fetched cv '+cvs);
                res.status(200).json(cvs);
            }
            catch(err){
                console.log(err)
            }
        }else{
            res.status(400).send({userStatus:userStatus})
        }
})

// Delete cv from my list
app.post('/removethe-cv', checkLiveOrDead, async (req,res)=>{
    const userStatus = req.userStatus;
    const id = userStatus._id;
    const _id = req.body.cvid;
    //console.log(_id)
        if( id ){
            try{
                const cvs = await Cv.deleteOne({_id});
                res.status(204).json(cvs);
            }
            catch(err){
                console.log(err)
            }
        }else{
            res.status(401).send({userStatus:userStatus})
        }
})

// get single cv by id
app.post('/single-cv', checkLiveOrDead, async(req,res)=>{
    const cvid = req.body.cv_id;
    //console.log('cvid ' + cvid)
    const userStatus = req.userStatus;
    const id = userStatus._id;
    if( id ){
        try{
            const cvs = await Cv.find({_id:cvid});
            //const cvs = await Cv.findById(id);
            //console.log('Fetched cv '+cvs);
            res.status(200).json(cvs);
        }
        catch(err){
            console.log(err)
        }
    }else{
        res.status(401).send({userStatus:userStatus})
    }
})

// send email to with OTP
function sendOtp(to,otp){
    let nodemailer = require('nodemailer');
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'dayana16@ethereal.email',
            pass: 'yzZ8KF7T1enkuda6dy'
        }
    });

    let mailOptions = {
    from: 'ram@klizos.com',
    to: 'sheikh@klizos.com',
    subject: 'Forgot Password Otp',
    text: 'Your otp is ' + otp
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    }); 
}



app.post('/send-email', async (req,res)=>{
    const emailFound = await User.find({email:req.body.email});
    //console.log(emailFound);
    if( emailFound.length>0 ){
        let generateOtp = Math.floor(1000 + Math.random() * 9000);
        try{    
            const emainInOtp = await Otp.findOne({email:req.body.email});
            let otp;
            
            if( emainInOtp ){
                otp = await Otp.updateOne({email: req.body.email},{otpCode:generateOtp})
            }else{
                otp = await Otp.create({
                    email: req.body.email,
                    otpCode: generateOtp
                })
            }
            
            

            sendOtp('_',generateOtp);
            
            res.status(201).json({mailStatus: 'send'});
            otp.save()
        }
        catch(err){
            console.log(err)
        }
    }else{
        res.status(400).json({msg:'email not found'})
    }

})


// fetch OTP and match with entered data
app.post('/match-otp', async (req,res)=>{
    const otp = req.body.otp;
    const email = req.body.email;
    let itsMatched = false;
    
    const otpData = await Otp.findOne({email:email});
    
    if( parseInt(otpData.otpCode) === parseInt(otp) ){
        itsMatched = true;
    }
    res.status(201).json({otpMatched: itsMatched})

})

app.post('/update-password', async (req,res)=>{
    let isPassUpdated = false;
    const password = req.body.password;
    const email = req.body.email;
    if( User ){
        const updateUser = await User.updateOne({email},{password})
        isPassUpdated = true;
    }
    res.status(201).json({passwordUpdated: isPassUpdated})

})

/* const isPassword = await bcrypt.compare(password,user.password);

            if( isPassword ){
                const token = await user.generateAuthToken();
                res.cookie('authToken', token, { expires: new Date(Date.now() + 900000), httpOnly: true })
                //console.log(token);
                res.status(201).send(user)
            } */


// get profile date
/* app.post("/getprofile",checkLiveOrDead, async (req, res) => {
    const userStatus = req.userStatus;
    const id = userStatus._id;
    if( id ){
        try{
            const {email} = req.body;
            const user = await User.findOne({email:email});
            
            res.status(201).send(user)
        }
        catch(err){
            console.log(err)
        }
    }
    res.status(400).send({userStatus:userStatus})
    
});
 */

// update profile
app.post("/update-profile",checkLiveOrDead, async (req, res) => {
    const userStatus = req.userStatus;
    const id = userStatus._id;
    //console.log(id)
    if( id ){
        const {firstName,lastName,phoneNumber} = req.body;
        //console.log(firstName)
        try{
            const user = await User.updateOne({_id:id},{
                firstName,
                lastName,
                phoneNumber
            });
            
            res.status(201).json(user).save()
        }
        catch(err){
            console.log(err)
        }
    }
    else{
        res.status(401).json({userStatus:userStatus})
    }
    
});
// to check if can read token or not
app.get('/token', checkLiveOrDead, (req,res)=>{
    const token = req.cookies.authToken;
    console.log(token)
    const userStatus = req.userStatus;
    const id = userStatus._id;
    console.log(id)
    //res.json({token})
    res.send(token)
} )

// logout and clear the cookie
app.post('/logout',(req, res)=>{
    res.clearCookie('authToken')
    res.status(204).json({})
})

// for testing purpose only

app.get('/users',(req, res)=>{
    res.json({name: 'hello'})
})

const  PORT =   process.env.PORT || 3001;
app.listen(PORT, ()=>{
    console.log('server running on '+PORT);
})
