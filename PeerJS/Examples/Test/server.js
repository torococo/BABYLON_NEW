var http = require('http');
var fs = require('fs');
var url = require('url');
var server;
var index=fs.readFileSync('index.html');
var client=fs.readFileSync('client.js');

server = http.createServer(function(req, res){
  var pathName=url.parse(req.url).pathname;
  if(pathName=="/"){
  res.writeHead(200,{'Content-Type':'text/html'});
  res.write(index);
  res.end();
  }
  else if(pathName=="/client.js"){
    res.writeHead(200,{'Content-Type':'application/javascript'});
    res.write(client);
    res.end();
  }
});


console.log("Listening for Connection!");
server.listen(8001);
