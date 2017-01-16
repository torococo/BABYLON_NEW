var http=require('http');
var fs=require('fs');
var url=require('url');
var ip=require('ip');
var list=require('../Helpers/List.js');
var PeerServer=require('peer').PeerServer;
var io=require('socket.io');


var PeerServer=function(onConnect,onDisconnect,onRecv,ServerPort,PeerPort){
  this._ServerPort=ServerPort;
  this._PeerPort=PeerPort;
  this._onConnect=onConnect;
  this._onDisconnect=onDisconnect;
  this._onRecv=onRecv;
  this._includeFiles={};
  this._peers={};
  this._IDhandler={
    //keeps track of peer IDs to make sure that no two peers get the smae one, recycles IDs when peers leave.
    reusableIDs:new list.LL(),
    lastID:1,
    getID:function(){
      if(this.reusableIDs.length>0){
        return this.reusableIDs.pop()
      }
      this.lastID+=1;
      return this.lastID-1;
    },
    pushOldID:function(id){
      this.reusableIDs.push(id);
    }
  };
};


PeerServer.prototype={

  includeFile:function(file,path,type){
    //adds a file to the server to be loaded when a peer joins
    this._includeFiles[path]={}
    try{
      this._includeFiles[path].text=fs.readFileSync(file);
      this._includeFiles[path].type=type;
    }catch(e){
      if(e.code==='ENOENT'){ console.log("Server can't find "+file+" to read"); }
      else{ console.log(e); }
    }
  },

  _fileServeFunc:function(req,res){
    //called by the server when a peer wants a file
    var pathNeeded=url.parse(req.url).pathname;
    var returnFile=this._includeFiles[pathNeeded];
    if(returnFile){
      res.writeHead(200,{'Content-Type':returnFile.type});
      res.write(returnFile.text);
      res.end();
    }
    else{ console.log("Server has no file for peer at path "+pathNeeded); }
  },

  runServer:function(){
    //runs the server on specified port
    this._ip=ip.address();
    this._Server=http.createServer(this._fileServeFunc.bind(this));
    this._Server.listen(this._ServerPort)
    this._peerIO=io.listen(this._Server);
    console.log(this._PeerPort);
    this._PeerServer=new PeerServer({port:this._PeerPort});
    console.log('server running on: '+this._ip+':'+this._ServerPort+' PeerPort:'+this._PeerPort);
    this._peerIO.sockets.on('connection',function(socket){
      //first contact with peers made inside this method, a new ID is found for the peer and sent.
      var peerID=this._IDhandler.getID();
      console.log('new Peer ID: '+peerID);
      socket.emit('givePeerID',{PeerID:peerID});
      //send ID to peer
      this._peers[peerID]={socket:socket,PeerID:peerID};
      var newPeer=this._peers[peerID];
      newPeer.socket.on('disconnect',function(socket){
        this._IDhandler.pushOldID(peerID);
        console.log("disconnected Peer ID: "+peerID);
        delete this._peers[peerID];
        this._onDisconnect(peerID);
      }.bind(this));
      newPeer.socket.on('data',function(data){
        this._onRecv(peerID,data);
      }.bind(this));
      this._onConnect(peerID);
    }.bind(this));
  },
  send:function(id,data){
    this._peers[id].socket.emit('data',data);
  }
}

testLoader=new PeerServer(function(id){this.send(id,"hi");},function(){},function(id,data){
  console.log(data);
},8001,8002);
testLoader.includeFile("./index.html","/","text/html");
testLoader.includeFile("./PeerClient.js","/PeerClient.js","application/javascript");
testLoader.includeFile("./peer.js","/peer.js","application/javascript");
testLoader.includeFile("./PeerClient.js","/PeerClient.js","application/javascript");
testLoader.includeFile("./lockstepClient.js","/lockstepClient.js","application/javascript");
testLoader.includeFile("./favicon.ico","/favicon.ico","image/x-icon");
testLoader.runServer();

if(typeof module!=='undefined'){
  module.exports.PeerServer=PeerServer;
}
