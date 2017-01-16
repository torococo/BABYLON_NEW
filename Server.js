"use strict";
var LSServer=require("./PeerJS/LSServer.js");

var Server=function(){
  var ret=new LSServer(8001,8002);
  ret.players=[];
  ret.inGame=[];
  ret.inLobby=[];
  ret.setConnect(function(id){
    console.log("new guest, id: "+id);
//    this.players.push(id);
//    this.inLobby.push(id);
//    if(this.inLobby.length===1){
//      console.log("starting new game!");
//      this.inGame.concat(this.inLobby);
//      this.sendGameStart(this.inLobby,Date.now()+5000,40);
      this.sendGameStart([id],Date.now()+5000,40);
//    }
    //for(var i=0;i<this.players.length;i++){
    //  this.send(this.players[i],{tag:"PlayerNum",num:i});
    //}
  }.bind(ret));
  ret.setDisconnect(function(id){
    console.log("id disconnect!: "+id);
    for(var i=0;i<this.players.length;i++){
      if(this.players[i]===id){
        this.players.splice(i,1);
      }
    }
    for(i=0;i<this.inLobby.length;i++){
      if(this.inLobby[i]===id){
        this.inLobby.splice(i,1);
      }
    }
    for(i=0;i<this.inGame.length;i++){
      if(this.inGame[i]===id){
        this.inGame.splice(i,1);
      }
    }
  }.bind(ret));
  ret.FastInclude=function(path,type){
    var fullType=null
    switch(type){
      case 'txt':fullType="text/html";break
      case 'js':fullType="application/javascript";break
      case 'img':fullType="image/x-icon";break
    }
    var splitPath=path.split("/")
    var fileName=splitPath[splitPath.length-1]
    this.includeFile(path,"/"+fileName,fullType)
  }
  ret.includeFile(__dirname+"/PeerJS/favicon.ico","/favicon.ico","image/x-icon");
  //ret.includeFile("/home/rafael/JS/BABYLON_NEW/node_modules/babylonjs/babylon.core.js","/babylon.js","application/javascript");
  ret.includeFile(__dirname+"/node_modules/babylonjs/babylon.max.js","/babylon.js","application/javascript");
  ret.includeFile(__dirname+"/node_modules/hand/hand.js","/hand.js","application/javascript");
  ret.includeFile(__dirname+"/node_modules/babylonjs/Oimo.js","/Oimo.js","application/javascript");
  ret.includeFile(__dirname+"/index.html","/","text/html");
  ret.includeFile(__dirname+"/BabyWrap.js","/BabyWrap.js","application/javascript");
  ret.includeFile(__dirname+"/baby.js","/baby.js","application/javascript");
  ret.includeFile(__dirname+"/node_modules/toji-gl-matrix-2aa7274/dist/gl-matrix-min.js","/gl-matrix.js","application/javascript");
//  ret.includeFile(__dirname+"/worldHeightMap.jpg","/worldHeightMap.jpg","image/x-icon");
  //ret.includeFile("/home/rafael/JS/BABYLON_NEW/waterbump.jpg","/waterbump.jpg","image/x-icon");
  ret.FastInclude(__dirname+"/waterbump.jpg","img")
  return ret;
};

var thisServ=new Server();
thisServ.runServer();
