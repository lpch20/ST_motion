//const http = require('http');
var request = require('request');

let source = "120";
let dest = "099268941";
let hostTarget = "200.108.253.229";
let portTarget = 6036;
let pathTarget = `/rest/originateCall?source=120&context=default_0&destination=9099268941&timeout=20`;
let url = 'http://' + hostTarget + ':' + portTarget + pathTarget;

const LOCAL_ADDRESS = '179.27.98.14';

// Set the headers
var headers = {
    'Content-Type':     'application/json'
}

// Configure the request
var options = {
    url: url,
    method: 'POST',
    headers: headers,
    localAddress: LOCAL_ADDRESS,
}

// Configure the request
//var options = {
//    url: url,
//    method: 'POST',
//    headers: headers,
//    localAddress: LOCAL_ADDRESS,
//    form: {"source" :source, "context" :"default_0", "destination": 9 + dest , "timeout": "15" }
//}

// Start the request
request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body)
    }else{
        console.log(error);
    }
})
