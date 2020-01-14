// Setup empty JS object to act as endpoint for all routes
const projectData = [{weather:'Weather is good!', condition:'I feel good!'}]; //an endpoint with a dummy entry.

// Require Express to run server and routes
var express = require('express');
var fetch = require('node-fetch');

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
const port = 8002;

const server = app.listen(port, listening);

function listening() {
    console.log('server running');
    console.log(`running on localhost: ${port}`);
}

const apiKey = '12a6896397a5e52cb5eb4ab069607559';

async function fetchWeatherAppDataByZip(zip) {
    const data = await fetch(`http://api.openweathermap.org/data/2.5/forecast?zip=${zip},us&APPID=${apiKey}`);
    const json = await data.json();
    const description = json.list[0].weather[0].description;
    console.log(description);
    return description;
}

async function addToProjectData(zip, message) {
    const weather = await fetchWeatherAppDataByZip(zip);
    const entry = {weather, message};
    projectData.push(entry);
    console.log(projectData);
}

function getParams(req){
    console.log(req.body);
    return req.body;
};

app.use('/entry', async (req, res) => {
    const parameters = getParams(req);
    await addToProjectData(parameters.zip, parameters.message);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(projectData[projectData.length-1]));
} );
