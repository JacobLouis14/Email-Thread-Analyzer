const express = require('express');



const app = express();


app.get("/",(req,res)=>{
    res.send('<a href = "">Authenticate With Google</a>')
})





const PORT = 5000;
app.listen(PORT,()=>{
    console.log(`Running on ${PORT}`)
})