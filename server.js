// init project
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mongoClient = require('mongodb').MongoClient;
const schema = require('./searchTerm');
const db = process.env.MONGO;
const cseId = process.env.CSEID;
const gkey = process.env.GKEYTWO;
const https = require('https');


mongoClient.connect(db, function(err, db) {

  //search api & save results to database  
  app.get("/api/search/:searchTerm(*)", (request, response, next) => {

    const searchTerm = request.params.searchTerm
    const offset = request.query;
    let searchResults = "";
    const url = "https://www.googleapis.com/customsearch/v1/" + '?key=' + gkey + '&cx=' + cseId + "&q=" + searchTerm + "&searchType=image";

    const data = new schema({
      searchTerm,
      searchDate: new Date()
    });
    
    data.save((err) => {
      if (err) {
        response.send('error' + err)
      }
    });
    
    // node https module 
    https.get(url, (res) => {
      res.on("data", (data) => {
        searchResults += data;
      });
      res.on("end", () => {

        let searchList = [];
        let parsed = JSON.parse(searchResults);
        let list = parsed.items;

        for (let i = 0; i < list.length; i++) {
          let data = {
            url: list[i].link,
            snippet: list[i].snippet,
            thumbnail: list[i].image.thumbnailLink,
            context: list[i].image.contextLink
          }
          searchList.push(data)
        }
        response.json(searchList);
      })
    }).on("error", (e) => {
      response.send("error" + e)
    });
  });

  //Retrieve entire search history from database
  app.get("/api/history", (req, res, next) => {
    schema.find({}, (err, data) => {
      res.json(data);
    })
  });
});

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});