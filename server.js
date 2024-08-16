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
    
    if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html")
    }
    else{
        res.sendFile(__dirname + "/failure.html")
    }
    
    response.on("data",function(data){
        console.log(JSON.parse(data));
    })
})
 request.write(jsondata)
 request.end();
})

app.post("/failure",function(req,res){
    res.redirect("/")
})
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', function() {
    console.log("Server is running on port " + port);
}); 
