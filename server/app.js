var express = require('express')
var app = express()
var cors = require('cors')
var dns = require('dns')

var urlList = {

}

app.use(cors())

    app.get('/new%20-%20:urlToShortern?', (req, res, next)=>{
        //get params
        //console.log(1)
        req.urlToShortern = req.params.urlToShortern
        next();
    }, (req, res, next)=>{
        //check if valid url
        console.log(req.urlToShortern)
            dns.lookup(req.urlToShortern, (err, address, family) => {
                if(err) {
                    res.send('invalid')
                    return
                } else next()
            });
    }, (req, res, next)=>{
        //check if the url is already in our object?
        if (Object.keys(urlList).length == 0) {
            res.send({'original_url:': req.urlToShortern, 'link': 1})
            urlList[1] = req.urlToShortern
        } else {
            //console.log(Object.keys(urlList))
            Object.keys(urlList).some(x=>{
                if (urlList[x] == req.urlToShortern) res.send(JSON.parse({'original_url:': req.urlToShortern, 'link': x}))
            })
        }
        next()
        //Object.keys(urlList).forEach(x=>console.log)
    }
    // , (req, res, next)=>{
    //     //res.send('fin')
    // }
    )

var listener = app.listen(3001, function(){
    console.log('working on port 3000')
});