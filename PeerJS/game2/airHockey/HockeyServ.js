var LSServer=require("/home/rafael/Dropbox/JS/PeerJS/LSServer.js");

var HockeyServ=function(){
  var ret=new LSServer.LSServer(8001,8002);
  ret.players=[];
  ret.inGame=[];
  ret.inLobby=[];
  ret.setConnect(function(id){
    console.log("new guest, id: "+id);
    this.players.push(id);
    this.inLobby.push(id);
    if(this.inLobby.length==1){
      console.log("starting new game!");
      this.inGame.concat(this.inLobby);
      this.sendGameStart(this.inLobby,Date.now()+500,40);
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
  ret.includeFile("/home/rafael/Dropbox/JS/PeerJS/game2/airHockey/SpaceShooter.js","/SpaceShooter.js","application/javascript");
  //ret.includeFile("/home/rafael/Dropbox/JS/Helpers/Game2d.js","/SpaceShooter.js","application/javascript");
  ret.includeFile("/home/rafael/Dropbox/JS/PeerJS/game2/airHockey/index.html","/","text/html");
  ret.includeFile("/home/rafael/Dropbox/JS/PeerJS/favicon.ico","/favicon.ico","image/x-icon");
  return ret;
};

var thisServ=new HockeyServ();
thisServ.runServer();
