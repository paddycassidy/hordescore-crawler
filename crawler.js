//express is the webserver library
const express = require('express');
//moment is a library for working with dates (may not be required)
const moment = require('moment');
//cors library
const cors = require('cors');
// use environment variables
require('dotenv').config()
//library for crawler
const puppeteer = require('puppeteer');

const app = express();

//serve static web pages
app.use(express.static(__dirname + '/public'));

//function to timestamp all logs
const log = function(message){
    var time = moment().format()
    console.log('[Server] '+ time + ' ' + message)
}

//config cors 
app.use(cors())

//Use puppeteer to scrape reddit
const scrape =  async () =>  {

    //const browser = await puppeteer.launch();
    const browser = await puppeteer.launch({headless: true, devtools: true});

    const page = await browser.newPage();
    const url = 'https://old.reddit.com/r/asxbets/';
    await page.goto(url);
    
    //gets the top 25 post titles on r/asxbets and stores in array called data
    let data = await page.evaluate(() => 
    Array.from(document.querySelectorAll('p[class="title"]')).map(post => post.textContent.trim()))

    await browser.close();

return data;
}

//endpoint for getting the crawled data set
app.get('/crawler',  async (req,res) => {
        log('Request made for crawled data')
        let result = await scrape();
        console.log(result);
        res.send(result)
})

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`CORS-enabled web server is listening on port ${port}`)
})