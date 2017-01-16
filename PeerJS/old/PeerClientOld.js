var Client=function(onConnect,onDisconnect,onRecv,ip,ServerPort,PeerPort){
  this._ip=ip;
  this._Peers={};
  this._PeerPort=PeerPort;
  this._onConnect=onConnect;
  this._onDisconnect=onDisconnect;
  this._onRecv=onRecv;
  this._serverSocket=io.connect(ip+':'+ServerPort);
  this._serverSocket.on('givePeerID',function(data){
    this.PeerID=data['PeerID'];
    this._peerSocket=new Peer(this.PeerID,{host:this._ip,port:this._PeerPort});
    this._peerSocket.on('connection',function(conn){
      //when peer connects, setup connection functions and call _onConnect
      var newPeerID=parseInt(conn.peer);
      console.log("accepted connection from peer ID: "+newPeerID);
      this._Peers[newPeerID]=conn;
      this._setupConnectionFunctions(newPeerID);
      this._onConnect(newPeerID);
    }.bind(this));
    //  this.onRecvServer('getPeerID',function(data){
    //    this.myPeer=new Peer(this.PeerID,{host:'192.168.1.2',port:8001});
    //    console.log(this.PeerID);
    //  };
    setTimeout(function(){
    this._onConnect('Server');
    }.bind(this),1000);
  }.bind(this));
};

Client.prototype={
  send:function(id,data){
    if(id==='Server'){
      this._serverSocket.emit('data',data);
    }
    else{
      if(this._Peers[id]){ 
        this._Peers[id].send(data); }
      else{console.log("unable to send message, peer is not connected!: "+id); }
    }
  },
  _setupConnectionFunctions:function(id){
    this._Peers[id].on('close',function(){
      delete this._Peers[id];
      console.log("peer ID: "+id+" disconnected");
      this._onDisconnect(id);
    }.bind(this));
    this._Peers[id].on('data',function(data){
      this._onRecv(id,data);
    }.bind(this));
  },
  connect:function(id){
    this._Peers[id]=this._peerSocket.connect(id);
    var PeerToSetup=this._Peers[id];
    if(PeerToSetup){
      this._setupConnectionFunctions(id);
      this._onConnect(id);
    }
    else{console.log("unable to connect to ID: "+id)};
  },
};

var me=new Client(function(id){
  console.log("connected");
},function(id){},function(id,data){
},'192.168.1.2',8001,8002);
//
//var canv=document.getElementById("myCanvas");
//var ctx=canv.getContext("2d");
//ctx.fillStyle="#FF0000";
//ctx.fillRect(0,0,150,75);
if(typeof module!=='undefined'){
  module.exports.Client=Client
}
