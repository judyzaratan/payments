var http = require('http');
var fs = require('fs');
var path = require('path');
var requestHandler = require("./request-handler.js");

http.createServer(requestHandler.requestHandler).listen(8000);
console.log('Server running at http://127.0.0.1:8000/');