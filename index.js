const express = require('express');
const userRouter = require('./routes/user')
const {google} = require('googleapis')
const session = require('express-session')

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
)

const app = express();
app.set('view engine', 'ejs');
app.use(session({secret: "key", resave: false, saveUninitialized:true, cookie:{maxAge: 600000}}))

//
app.use('/',userRouter)








const PORT = 5000;
app.listen(PORT,()=>{
    console.log(`Running on ${PORT}`)
})