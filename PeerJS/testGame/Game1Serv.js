var LSServer=require("/home/rafael/Dropbox/JS/PeerJS/LSServer.js");

var Game1Serv=function(){
  var ret;
  ret=new LSServer.LSServer(8001,8002);

  ret.setConnect(function(id){
    console.log("new guest connection, id: "+id);
    this.players.push(id);
    if(this.players.length===2){
      console.log("starting new game!");
      this.sendGameStart(this.players,Date.now()+1000,100);
      this.gaming.concat(this.players.slice(0,2));
      this.players=this.players.slice(2);
    }
  }.bind(ret));
  ret.setDisconnect(function(id){
    for(var i=0; i<this.players.length;i++){
      if(this.players[i]===id){
        delete this.players[i];
      }
    }
    for(i=0; i<this.gaming.length;i++){
      if(this.gaming[i]===id){
        delete this.gaming[i];
      }
    }
  }.bind(ret));
  ret.setRecv(function(id,data){
    console.log("got a message from id: "+id);
    console.log(data);
  }.bind(ret));
  ret.gaming=[];
  ret.players=[];
  return ret;
};


var testGame1Serv=new Game1Serv();

testGame1Serv.includeFile("/home/rafael/Dropbox/JS/PeerJS/testGame/Game1.js","/Game1.js","application/javascript");
testGame1Serv.includeFile("/home/rafael/Dropbox/JS/PeerJS/testGame/index.html","/","text/html");
testGame1Serv.includeFile("/home/rafael/Dropbox/JS/PeerJS/favicon.ico","/favicon.ico","image/x-icon");

testGame1Serv.runServer();
