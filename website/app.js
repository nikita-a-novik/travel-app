/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

function getZip(){
    return document.getElementById('zip').value;
}

function getMessage(){
    return document.getElementById('feelings').value;
}

async function postStuff() {
    const data = {zip:getZip(), message:getMessage()};
    console.log(data);
    const response = await fetch('/entry', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });

    const result = await response.json(); // parses JSON response into native JavaScript objects
    console.log(result);
    document.getElementById('content').innerHTML = `Weather: ${result.weather}, Notes: ${result.message}`;
}

document.getElementById('generate').addEventListener('click', postStuff);

