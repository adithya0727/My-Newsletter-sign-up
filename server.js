const express = require('express')
require('dotenv').config();
const app = express()
const bodyparser = require('body-parser');
const https = require("https");

app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.get("/", function(req,res){
    res.sendFile(__dirname + "/index.html")
})
app.post("/", function(req,res){
    var firstname = req.body.fname
    var lastname = req.body.lname
    var email = req.body.email
    console.log(firstname,lastname,email)

var data = {
  members : [
    {
        email_address : email,
        status: "subscribed",
        merge_fields : {
            FNAME : firstname,
            LNAME : lastname
        }
    }
  ]  
};
const jsondata = JSON.stringify(data);
const api_key = process.env.API_KEY;
const url = "https://us21.api.mailchimp.com/3.0/lists/acf856d8bf";

const options = {
    method: "POST",
    headers: {
     Authorization: "auth " + api_key  
    }
};


const request = https.request(url,options,function(response){
    
    let responseBody = '';
    response.on("data", function(chunk) {
        responseBody += chunk;
    });
    response.on("end", function() {
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        }
        else{
            res.sendFile(__dirname + "/failure.html")
        }
        try {
            console.log(JSON.parse(responseBody));
        } catch (error) {
            console.error(error);
        }
    })
})
 request.write(jsondata)
 request.end();
})

app.post("/failure",function(req,res){
    res.redirect("/")
})
 
const port = process.env.PORT || 10000;
app.listen(port, function() {
  console.log("Server running on port ${port}")
})

