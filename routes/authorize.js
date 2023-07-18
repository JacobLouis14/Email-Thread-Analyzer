const router = require('express').Router()
const {google} = require('googleapis');
require('dotenv').config()


router.get('/', (req,res)=>{

    const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    )
    const scopes = ["https://mail.google.com/"]

    const authorizationUrl = oAuth2Client.generateAuthUrl({
        response_type: 'code',
        access_type: 'offline',
        scope: scopes,
        include_granted_scopes: true
    })
    res.redirect(authorizationUrl)
    

})

router.get('/home',(req,res)=>{
    res.send('hi')
})




module.exports = {router}