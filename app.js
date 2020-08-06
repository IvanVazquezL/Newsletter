const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));
// app.get("/",function(request,response){
//   response.sendFile(__dirname + "/signup.html");
//
// });
app.set('view engine', 'pug');

app.post("/",function(request,res){
  var fname = request.body.fname;
  var lname = request.body.lname;
  var email = request.body.email;

  var data = {
    members:[
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME: fname,
          LNAME: lname
        }
      }

    ]

  };

  var jsonData = JSON.stringify(data);

  const url = "https://us17.api.mailchimp.com/3.0/lists/c493b6c6b7"

  const options = {
    method: "POST",
    auth: "ivan1:f7ebe0a4c1d78bb5e02b0af4a0931e34-us17"
  }
  const req = https.request(url,options,function(response){
    console.log(response.statusCode)

    response.on("data",function(data){
      console.log(JSON.parse(data));
      var data = JSON.parse(data);

      if(data.error_count===0){
        res.sendFile(__dirname + "/public/success.html");
      }
      else{
        // res.sendFile(__dirname + "/public/failure.html");
        // res.send(data.errors[0].error);
        res.render('failure', { error: data.errors[0].error });
      }
    });
  });

  req.write(jsonData);
  req.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");
})


app.listen(8080,function(){
  console.log("Server started on port 8080");
})

//API KEY
//f7ebe0a4c1d78bb5e02b0af4a0931e34-us17

//lIST ID
//c493b6c6b7
