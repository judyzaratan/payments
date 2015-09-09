var http = require('http');
var fs = require('fs');
var path = require('path');
var requestHandler = require("./request-handler.js");


//start up server
var port = 8000;
http.createServer(requestHandler.requestHandler).listen(port);
console.log('Server running at http://127.0.0.1:' + port + '/');