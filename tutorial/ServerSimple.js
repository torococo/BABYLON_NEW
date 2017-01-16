"use strict";
var http=require('http');
var fs=require('fs');
var url=require('url');

var Server=function(){
  this.files={};
};

Server.prototype.AddFile=function(path,name,type){
  if(type==='js'){
    type='application/javascript';
  }
  if(type==='txt'){
    type='text/html';
  }
  var text=fs.readFileSync(path,'utf8');
  if(text){
    this.files[name]={'type':type,'text':text};
  }
  else{ console.log("could not read in file at path "+path);}
};

Server.prototype.ServeFile=function(req,res){
  var reqPath=url.parse(req.url).pathname;
  var fileInfo=this.files[reqPath];
  if(fileInfo){
    res.writeHead(200,{'Content-Type':fileInfo.type});
    res.write(fileInfo.text);
    res.end();
  }
  else{
    console.log("could not pass file named "+reqPath);
    console.log(Object.keys(this.files));
  }
};

Server.prototype.Run=function(port){
  this.server=http.createServer(this.ServeFile.bind(this));
  this.server.listen(port);
  console.log("listening on port "+port);
};

var srv=new Server();
srv.AddFile("/home/rafael/JS/BABYLON_NEW/tutorial/babylon.js","/babylon.js",'js');
srv.AddFile("/home/rafael/JS/BABYLON_NEW/tutorial/baby.js","/baby.js",'js');
srv.AddFile("/home/rafael/JS/BABYLON_NEW/tutorial/index.html","/",'txt');

srv.Run(8001);
