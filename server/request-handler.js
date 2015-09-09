var fs = require("fs");
var path = require("path");
var querystring = require("querystring");
var url = require("url");
var db = require("./transactions.js");

var exports = module.exports;
exports.requestHandler = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);
  // Outgoing status
  var statusCode = 200;

  //Parses out request url and query string
  var pathName = url.parse(request.url, true).pathname;
  var query = url.parse(request.url, true).query;

  //Format according to 
  if (pathName === "/"){
    pathName = "client/index.html"
  } 

  var filePath = "./" + pathName;

  if (filePath == './transactions'){
    var data = JSON.stringify(db.getTransactions(parseInt(query.id)));
    response.writeHead(200, {'Content-Type': "application/json"});
    response.write(data, 'utf-8');
    response.end();
  } else{

  var extname = path.extname(filePath);
  var contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
  }
  fs.exists(filePath, function(exists) {
    console.log(filePath, 'exists', exists);
    if (exists) {
      fs.readFile(filePath, function(error, content) {
        if (error) {
          response.writeHead(500);
          response.end();
        }
        else {
          response.writeHead(200, { 'Content-Type': contentType });
          response.write(content, 'utf-8');
          response.end();
        }
      });
    }
    else {
      response.writeHead(404);
      response.end();
    }
  });
  }
};
