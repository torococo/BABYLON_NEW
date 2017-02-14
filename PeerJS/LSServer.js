"use strict";
var ServerP=require("./ServerP.js");
var Helpers=require("./Helpers/Helpers.js");

var LSServer=function(SockPort,PeerPort){
  var ret=new ServerP.ServerP(SockPort,PeerPort);
  ret.includeFile(__dirname+"/favicon.ico","/favicon.ico","image/x-icon");
  ret.sendGameStart=function(ids,duration){
    for(var idI in ids){
      console.log("Sent ids"+ids+"Duration"+duration);
      this.send(ids[idI],{tag:"_StartGame",ids:ids,duration:duration,playerNum:idI});
    }
  };
  ret.tagFuncs=new Helpers.tagFuncs();
  ret.includeFile(__dirname+"/ClientP.js","/ClientP.js","application/javascript");
  ret.includeFile(__dirname+"/LSPeer.js","/LSPeer.js","application/javascript");
  ret.includeFile(__dirname+"/Helpers/Helpers.js","/Helpers.js","application/javascript");
  ret.includeFile(__dirname+"/Helpers/List.js","/List.js","application/javascript");
//  ret.includeFile("/home/rafael/JS/Helpers/CircWorld.js","/CircWorld.js","application/javascript");
  ret.setRecv(function(id,data){
    this.tagFuncs.run(data);
  });
  return ret;
};

//  this.SockPort=SockPort;
//  this.PeerPort=PeerPort;
//  this.onConnect=onConnect;
//  this.onDisconnect=onDisconnect;
//  this.onRecv=onRecv;


//purpose is to start connections between peers. when two peers look like they wanna game, send each a command to contact each other, and tell one to tell the other to start the game at a time they see fit.
//
if(typeof module!=='undefined'){
  module.exports=LSServer;
  //module.exports.LSServer=LSServer;
}
