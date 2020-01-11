// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
var express = require('express');
var fetch = require('node-fetch');
var router = express.Router();

// Start up an instance of app
var app = express();
var bodyParser = require('body-parser');

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
const port = 8001;

const server = app.listen(port, listening);

function listening() {
    console.log('server running');
    console.log(`running on localhost: ${port}`);
}

router.get('/all', function(req, res) {
    res.send('hello world');
})

module.exports = router;


// var wiki = require('/wiki.js');

const entries = [{weather:'Weather is good!', condition:'I feel good!'}];



const apiKey = '12a6896397a5e52cb5eb4ab069607559';

// http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID={APIKEY}

// fetch(`http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=${apiKey}`)
//     .then((response) => {
//       return response.json();
//     })
//     .then((myJson) => {
//       console.log(myJson);
//     });



async function fetchWeatherAppDataByZip(zip) {
    const data = await fetch(`http://api.openweathermap.org/data/2.5/forecast?zip=${zip},us&APPID=${apiKey}`);
    return data.json();
}

// api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}

async function addToEntries(zip, message) {
    const weather = await fetchWeatherAppDataByZip(zip);
    const entry = {weather, message};
    entries.push(entry);
}

function getParams(req){
    console.log(req.body);
    return req.body;
};

app.use('/entry', (req, res) => {
    const parameters = getParams(req);
    addToEntries(parameters.zip, parameters.message);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(entries[entries.length-1]));
} );
