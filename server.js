// init project
var express = require('express');
var app = express();
const apiKey = process.env.GOOGLEAPIKEY;

const mongoose = require('mongoose');
const mongoClient = require('mongodb').MongoClient;
const schema = require('./searchTerm');
const db = process.env.MONGO;
const GoogleImages = require('google-images');
const client = new GoogleImages('cseId', 'apiKey');
const cseId = process.env.CSEID;
const gkey = process.env.GKEYTWO;


var request = require('request');
const https = require('https');
const url = "https://www.googleapis.com/customsearch/v1" + '?key=' + gkey + '&cx=' + cseId + "&q=cats";

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


mongoClient.connect(db, function(err,db){


  
app.get("/api/search/", function (request, response, next) {
  
  const searchTerm = request.params.searchTerm 
  const offset = request.query;
  let returnedData = "";
  
  // node https module 
 https.get(url, function (res){
 // console.log(response);
   console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);
   
    
   res.on("data", function(data){
     returnedData += data;
           
   });
  res.on("end", function(){
  console.log(returnedData);
    
    response.json(returnedData);
    
  })
 }).on("error",function(e){
 console.log(e);
 }); 
  
}); 
  
  
//   const data = new schema({
//     searchTerm,
//     searchDate: new Date()
//   });
  
//   data.save((err) => {

//       if (err) {
//         console.log('ooops, sorry an error has occurred' + err);
//         response.send('error' + err)
//       }
//     });
//     return response.json(data);

//   });

  
//Retrieve entire search history from database
 app.get("/api/history", function(req, res, next){
   
    schema.find({}, function (err, data){
        res.json(data);
    })
  });  
  
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
