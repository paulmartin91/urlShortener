'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var dns = require('dns')

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;
app.use('/public', express.static(process.cwd() + '/public'));
/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);

app.use(cors());

//uncomment below to connect to mongodb
//process.env.MONGO_URI = [add in MongoDB URI]

//uncomment below to connect locally
process.env.MONGO_URI = 'mongodb://localhost:27017'

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client)=>{
  if (err){console.log(err)} else {console.log('mongo db connected')}
  return;
});


var urlSchema = new mongoose.Schema({
  _id: Number,
  url: String,
});

var Urls = mongoose.model("urls", urlSchema);

//get full list
app.get('/api/getlist', async (req, res, done) => {
    const getList = await Urls.find({}, async (err, fullList, done) => {
        const addList = req.fullList = await fullList
    })
    done()
}, (req, res)=>{
  res.send(req.fullList)
})

//delete all instances of a specific URL
app.get("/api/removeAll:urltodelete?", async (req, res) => {

  //delete all in query
  const del = await Urls.deleteMany({/* url: req.params.urltodelete  <- leave this blank to delete all */ }, (err, res) => {
    if (err) {
      console.log(err)
      res.send(`no matching url's on record`)
      done()
    }
    console.log(res)
  });

  //check all are deleted
  const results = await Urls.findOne({ url: req.params.urltodelete });

  //return result
  results == null ? res.send('all deleted') : res.send(`error ${results}`)
});


//get new url request
app.get('/new%20-%20:urlToShortern(*)', async (req, res, done) => {

  const fulllist = await Urls.find({}, async (err, fullList) => {
    if (err) console.log(err)
    req.fullList = await fullList
  })

  //save params
  req.urlToShortern = await req.params.urlToShortern;
  
  //check if valid DNS
  dns.lookup(req.urlToShortern, async (err, address, family) => {
    if(err || address == '92.242.132.24') {
      //if invalid, send message
      console.log(`invalid dns - error ${err}`)
      res.send('invalid DNS')
    } else {
      console.log(`valid dns at ${address}` )
      req.validDNS = await true
      done()
    }
  })
  
}, async (req, res, done)=>{
  
  //check if url already exists
  const findURL = await Urls.findOne({url: req.urlToShortern}, async (err, instance) => {
    if (err) console.log(err)
    
    //if it doesn't...
    if (instance == null) {
    
    //count number of instances
    req.number = await parseInt(req.fullList[req.fullList.length-1].id)+1
    console.log(req.number)

    //create new instance with param as url and n instances+1 as _id
    const createNew = await Urls.create({url: req.urlToShortern,  _id: req.number}, async (err, instance)=>{
      if (err) console.log(err)
      
      //return new instance
      req.instance = await instance

      //add new instance
      const addInstance = await req.fullList.push(req.instance)
      
      done();  
    });
    
    } else {
      //return existing instance
      req.instance = await 'existing instance'
      console.log('existing instance')
      done();
    }
  })

  
}, async (req, res)=>{

  let resultObj = await {}

  //add full list of urls to response
  resultObj.fullList = await req.fullList
  
  //add instance to response
  resultObj.instance = await req.instance
  const log = await console.log(`full list = ${resultObj.fullList}`)
  res.send(resultObj)
  return;
})


//handle url number requests
app.get('/:short(*)', async (req, res) => {
  
  console.log('number request')
  
  //check if valid url number
  if (/^\d+$/.test(req.params.short)){
    console.log(req.params.short)
    
    //save params
    var num = await req.params.short
  
    //check if number exists
    const findInstance = await Urls.findById(num, (err, data) => {
      if (err) console.log(err)
      
      //if it doesn't send message
      if (data == null) {
        console.log('number not found')
        res.send('number not on record')
      } else {
        console.log(`number found - ${data.url}`)
        res.redirect(`https://${data.url}`)
      }
    })
  } else {
    res.send(`invalid url`)
  }
})
  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get('/', (req, res)=> console.log(`3`))

app.listen(3001, function () {
  console.log('Node.js listening ...');
});