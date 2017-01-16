var http=require('http');
var fs=require('fs');
var url=require('url');
var ip=require('ip');
var list=require('../Helpers/List.js');
var PeerServer=require('peer').PeerServer;
var io=require('socket.io');

/* INPUT FUNCTION TYPES:
 * onConnect(id)
 * onDisconnect(id)
 * onRecv(id,data)
 */

var ServerP=function(ServerPort,PeerPort){
  this._ServerPort=ServerPort;
  this._PeerPort=PeerPort;
  this._includeFiles={};
  this._peers={};
  this._IDhandler={
    //keeps track of peer IDs to make sure that no two peers get the smae one, recycles IDs when peers leave.
    reusableIDs:new list.LL(),
    lastID:1,
    getID:function(){
//      if(this.reusableIDs.length>0){
//        return this.reusableIDs.pop();
//      }
      this.lastID+=1;
      return this.lastID-1;
    },
//    pushOldID:function(id){
//      this.reusableIDs.push(id);
//    }
  };
this.includeFile("/home/rafael/JS/PeerJS/peer.js","/peer.js","application/javascript");
};


ServerP.prototype={

  includeFile:function(file,path,type){
    //adds a file to the server to be loaded when a peer joins
    this._includeFiles[path]={};
    try{
      this._includeFiles[path].text=fs.readFileSync(file);
      this._includeFiles[path].type=type;
    }catch(e){
      if(e.code==='ENOENT'){ console.trace("Server can't find "+file+" to read"); }
      else{ console.log(e); }
    }
  },

  setConnect:function(func){
    this._onConnect=func;
  },

  setDisconnect:function(func){
    this._onDisconnect=func;
  },

  setRecv:function(func){
    this._onRecv=func;
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
    else{ (String("Server has no file for peer at path "+pathNeeded)); }
  },

  runServer:function(){
    //runs the server on specified port
    this._ip=ip.address();
    //this._ip='127.0.0.1'
    this._Server=http.createServer(this._fileServeFunc.bind(this));
    this._Server.listen(this._ServerPort);
    console.log(this._PeerPort);
    this._PeerServer=new PeerServer({port:this._PeerPort});
    this._peerIO=io.listen(this._Server);
    console.log('server running on: '+this._ip+':'+this._ServerPort+' PeerPort:'+this._PeerPort);
    this._peerIO.sockets.on('connection',function(socket){
      //first contact with peers made inside this method, a new ID is found for the peer and sent.
      var peerID=this._IDhandler.getID();
      socket.emit('givePeerID',{PeerID:peerID,PeerPort:this._PeerPort});
      //send ID to peer
      this._peers[peerID]={socket:socket,PeerID:peerID};
      var newPeer=this._peers[peerID];
      newPeer.socket.on('disconnect',function(socket){
//        this._IDhandler.pushOldID(peerID);
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
    if(this._peers[id]){
    this._peers[id].socket.emit('data',JSON.stringify(data));
    }
    else{
      throw("Server can't send to peer "+id+" it does not exist!");
    }
  }
};

//testLoader=new Server(function(){},function(){},function(id,data){
//  console.log(data);
//},8001,8002);
//testLoader.includeFile("./index.html","/","text/html");
//testLoader.includeFile("./client.js","/client.js","application/javascript");
//testLoader.includeFile("./peer.js","/peer.js","application/javascript");
//testLoader.runServer();

if(typeof module!=='undefined'){
  module.exports.ServerP=ServerP;
}
