var http = require('http');
var fs = require('fs');
var path = require('path');

var requestHandler = require("./request-handler.js");

var port = process.env.PORT || 8000;

//start up server
http.createServer(requestHandler.requestHandler).listen(port);
console.log('Server running at http://127.0.0.1:' + port + '/');