// init project
var express = require('express');
var app = express();
const api = process.env.APIKEY;

const mongoose = require('mongoose');
const mongoClient = require('mongodb').MongoClient;
const schema = require('./searchTerm');
const db = process.env.MONGO;


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

mongoClient.connect(db, function(err,db){
app.get("/api/search/:searchValue(*)", function (request, response) {
  
  const searchTerm = request.params.searchValue;
  const offset = request.query;
  
  const data = new schema({
    
    searchTerm,
    searchDate: new Date()
  });
  
  data.save((err) => {

      if (err) {
        console.log('ooops, sorry an error has occurred' + err);
        response.send('error' + err)
      }
    });
    return response.json(data);


  });
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
