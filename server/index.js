//
// To run the server say:
// npm install
// node index.js
//
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser());

// Fix CORS
app.all('/*', function (req, res, next) {
    // console.log("/*", req.headers['origin']);
    // Allow requests from anywhere...
    res.header("Access-Control-Allow-Origin", req.headers['origin']);
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// Log the UI error
app.post('/error', function (req, res) {
    // Possibly log req headers and such...
    var IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var date = new Date();
    console.log("[" + date.toLocaleString() + "][ERROR][" + IP + "] :\n" + JSON.stringify(req.body, null, 2));
    console.log("\n");
    console.log();
    console.log("\n");
    res.json(true);
});

// Start listening
app.listen(process.env.PORT || 3000);

console.log("Your error logging server is now listening at port: ", process.env.PORT || 3000);
var date = new Date();