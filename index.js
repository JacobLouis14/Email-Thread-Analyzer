const express = require('express');
const {router} = require('./routes/authorize')
const {google} = require('googleapis')
const path = require('path')


const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
)

const app = express();


//
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname + '/Pages/login.html'))
})

//
app.use('/login', router)

//
app.get('/callback',async (req,res)=>{
    const authorizationCode = req.query.code;

    async function token(){
        const {tokens} = await oAuth2Client.getToken(authorizationCode)
        oAuth2Client.setCredentials(tokens)
        // console.log(tokens)
        let userCredentials = tokens;
        
    

    
        const gmail = google.gmail({version: 'v1', auth: oAuth2Client})
        const response = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10
        })
        const labels = response.data.messages
        res.send(labels)
    }

    token()
    
    
    
    
    
})

app.use('/home', router)




const PORT = 5000;
app.listen(PORT,()=>{
    console.log(`Running on ${PORT}`)
})