const express = require('express');
require('dotenv').config();
const app = express();

const bodyparser = require('body-parser');
const https = require("https");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;
    console.log(firstname, lastname, email);

    // Data to be sent in the POST request body
    const data = {
        key: process.env.API_KEY,  // Mandrill API key from environment variables
        message: {
            from_email: "your_email@example.com",
            to: [
                {
                    email: email,
                    name: firstname + " " + lastname,
                    type: "to"
                }
            ],
            subject: "Welcome!",
            text: "Hello " + firstname + ", welcome to our service!"
        }
    };

    const jsondata = JSON.stringify(data);
    const url = "https://mandrillapp.com/api/1.0/messages/send.json";

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }
    };

    const request = https.request(url, options, function(response) {
        let responseData = '';
        response.on('data', function(chunk) {
            responseData += chunk;
        });

        response.on('end', function() {
            const parsedData = JSON.parse(responseData);
            console.log(parsedData);

            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
        });
    });

    request.on('error', function(e) {
        console.error(e);
        res.sendFile(__dirname + "/failure.html");
    });

    request.write(jsondata);
    request.end();
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
    console.log('listening on port 3000');
});



app.listen(process.env.PORT || 3000, function(){
    console.log('listening on port 3000')
})

