var LSServer=require("/home/rafael/JS/PeerJS/LSServer.js");

var HockeyServ=function(){
  var ret=LSServer(8001,8002);
  ret.players=[];
  ret.inGame=[];
  ret.inLobby=[];
  ret.setConnect(function(id){
    console.log("new guest, id: "+id);
    this.players.push(id);
    this.inLobby.push(id);
    if(this.inLobby.length==2){
      console.log("starting new game!");
      this.inGame.concat(this.inLobby);
      this.sendGameStart(this.inLobby,Date.now()+5000,40);
    }
    //for(var i=0;i<this.players.length;i++){
    //  this.send(this.players[i],{tag:"PlayerNum",num:i});
    //}
  }.bind(ret));
  ret.setDisconnect(function(id){
    console.log("id disconnect!: "+id);
    for(var i=0;i<this.players.length;i++){
      if(this.players[i]==id){
        this.players.splice(i,1);
      }
    }
    for(i=0;i<this.inLobby.length;i++){
      if(this.inLobby[i]==id){
        this.inLobby.splice(i,1);
      }
    }
    for(i=0;i<this.inGame.length;i++){
      if(this.inGame[i]==id){
        this.inGame.splice(i,1);
      }
    }
  }.bind(ret));
  ret.includeFile("/home/rafael/JS/PeerJS/airHockey/index.html","/","text/html");
  ret.includeFile("/home/rafael/JS/PeerJS/airHockey/Hockey.js","/Hockey.js","application/javascript");
  ret.includeFile("/home/rafael/JS/PeerJS/favicon.ico","/favicon.ico","image/x-icon");
  return ret;
};

var thisServ=new HockeyServ();
thisServ.runServer();
