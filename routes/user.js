const router = require('express').Router()
const { response } = require('express');
const {google} = require('googleapis');
const { gmail } = require('googleapis/build/src/apis/gmail');
require('dotenv').config()


const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
)
const scopes = ["https://mail.google.com/"]

//Variable declarations
let messageIds = [];
let inboxMessages = [];
let userCredentials
let fromDetails = []
let fromaddress = []
let sendDetails = []


router.get('/', (req,res)=>{
    let user =req.session.tokens
    if(user) res.redirect('/home')
    else res.render('login')
})    


router.get('/login', (req,res)=>{
    
    const authorizationUrl = oAuth2Client.generateAuthUrl({
        response_type: 'code',
        access_type: 'offline',
        scope: scopes,
        include_granted_scopes: true
    })
    res.redirect(authorizationUrl)
})
  

router.get('/callback',async (req,res)=>{
    const authorizationCode = req.query.code;
    const gmail = google.gmail({version: 'v1', auth: oAuth2Client})


    //function for making token
    async function token(){
        const {tokens} = await oAuth2Client.getToken(authorizationCode)
        req.session.tokens = tokens
        oAuth2Client.setCredentials(req.session.tokens)
        userCredentials = tokens;

        inbox().then(checkHistory)
        // sendAutoMessage()
    }

    //function for retriving emails
    async function inbox(){
        
        //storing emails id
        let response = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10,
            q: 'is:unread' && 'category:primary'
        })
        let inbox = response.data.messages
        messageIds = inbox.map((message) => message.id)

        //for storing each messages
        for(let id of messageIds){
            let response = await gmail.users.messages.get({
                userId: 'me',
                id: id,
                // q: 'in:inbox'
            })
            inboxMessages.push(response.data)

            //fetching from address
            let addressValue = response.data.payload.headers
                .find((value)=>value.name == 'From').value
            let fromadd = addressValue.substring(addressValue.indexOf('<')+ 1,
            addressValue.lastIndexOf('>'))
            fromaddress.push(fromadd)
            fromDetails.push(JSON.stringify({from: fromadd}))
        }
        res.redirect('/home')
        
    }

    //function for finding the history of a gmail address
    async function checkHistory(){
        for(let eachId of fromaddress){
            let response = await gmail.users.messages.list({
                userId: 'me',
                q: `from: ${eachId}`
            })
            if(response.data.resultSizeEstimate == 0) sendAutoMessage(eachId)
        }
    }

    //function for auto sending mail (to new incomming address)
    async function sendAutoMessage(emailId){

                const emailContent = `From: louisjacob8@gmail.com
To: ${emailId}
Subject: Replay by Bot

we will get to you shortly
`;
                let response = await gmail.users.messages.send({
                    userId: 'me',
                    requestBody: {
                        raw: Buffer.from(emailContent).toString('base64'),
                      },
                })
                sendDetails.push(response.data)
        }

    

    token()
})


router.get('/home',(req,res)=>{
    res.render('home',{data:{emailData:inboxMessages}});
    
})

router.get('/send',(req,res)=>{
    res.render('messagesend')
})




module.exports = router