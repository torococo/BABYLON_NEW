/* INPUT FUNCTION TYPES
 * onConnect(id)
 * onDisconnect(id)
 * onRecv(id,data)
 */

var PeerClient=function(ip,ServerPort){
  this._ip=location.hostname;
  console.log(this._ip);
  this._Peers={};
  //this._serverSocket=io.connect(this._ip+':'+ServerPort);
  this._serverSocket=io.connect();
  this._serverSocket.on('givePeerID',function(data){
    this.PeerID=data.PeerID;
    console.log("got PeerID "+data.PeerID);
    //this._PeerPort=data['PeerPort'];
    this._PeerPort=8002;
    this._peerSocket=new Peer(this.PeerID,{host:this._ip,port:this._PeerPort});
    this._peerSocket.on('connection',function(conn){
      console.log("connected to server!");
      //when peer connects, setup connection functions and call _onConnect
      this._setupPeer(conn);
    }.bind(this));
    this._onConnect('Server');
  }.bind(this));
  this._serverSocket.on('data',function(data){
    this._onRecv('Server',data);
  }.bind(this));
};

PeerClient.prototype={
  setConnect:function(func){
    this._onConnect=func;
  },
  setDisconnect:function(func){
    this._onDisconnect=func;
  },
  setRecv:function(func){
    this._onRecv=func;
  },
  send:function(id,data){
    if(id==='Server'){
      this._serverSocket.emit('data',JSON.stringify(data));
    }
    else{
      if(this._Peers[id]){ 
        this._Peers[id].send(JSON.stringify(data)); }
        else{throw("unable to send message, peer is not connected!, or connection has not been opened yet: "+id); }
    }
  },
  _setupPeer:function(conn){
    conn.on('open',function(){
      var id=parseInt(conn.peer);
      this._Peers[id]=conn;
      this._Peers[id].on('close',function(){
        //delete this._Peers[id];
        this._onDisconnect(id);
      }.bind(this));
      this._Peers[id].on('data',function(data){
        this._onRecv(id,data);
      }.bind(this));
      this._onConnect(id);
    }.bind(this));
  },
  connect:function(id,counter){
    var connection=this._peerSocket.connect(id);
    if(!connection&&counter>0){
      setTimeout(function(){
        counter-=1;
        console.log("unable to connect to peerID "+id+" retrys: "+counter);
        this.connect(id,counter).bind(this);
      },1000);
    }
    if(connection){
    this._setupPeer(connection);
    }
    else{
      console.error("gave up on setting up connection!");
    }
//    var connection=this._peersocket.connect(id);
//    this._setupPeer(this._peersocket.connect(id));
  },
  disconnect:function(id){
    if(this._Peers[id]){
      this._Peers[id].close();
      delete this._Peers[id];
    }
    else{throw("unable to disconnect from peer, "+id+" peer is not yet connected!");
    }
  }
};

if(typeof module!=='undefined'){
  module.exports.PeerClient=PeerClient;
}
