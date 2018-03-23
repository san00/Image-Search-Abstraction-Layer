//schema - set up db object

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO);
const Schema = mongoose.Schema;

const searchTermSchema = new Schema({
  
searchTerm:String,
  searchDate:Date

},{timestamps:true});

module.exports = mongoose.model('searchTerm',searchTermSchema); //searchTerm is the schema name