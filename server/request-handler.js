var fs = require("fs");
var path = require("path");
var exports = module.exports;

exports.requestHandler = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);

  // The outgoing status.
  var statusCode = 200;
  var headers = defaultCorsHeaders;

  var filePath = '.' + request.url;
  if (filePath == './'){
    filePath = './client/index.html';
  }
  if (filePath == './transactions'){
    filePath = './server/transactions.json';
  }
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
};
