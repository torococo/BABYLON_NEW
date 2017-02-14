//$  OLD NOTES
// *>>>  upon getting a new (old) move in this state, if it is not on list of new states, send it alone immediately? (good idea for ensuring all peers get message eventually?) robuster... but more potentially traffic heavy, could bog down system... I advise against for now...

/*
 * need to break away from reliance on perfect timing.
 * 1) start at same time (according to server)
 * 2) at end of first round, if plans not collected, resend and wait
 * 3) if waiting, as soon as plans are collected, resume and send new plans (and increment wait time)
 * 4) if not waiting, decrement wait time slightly
//< */

//$ LS PEER INIT
var LSPeer=function(ServerPort,RunFunc,stallFunc){
  var ret=new PeerClient(ServerPort);
  ret.addMovePack=function(PC,newPack){
    if(newPack.tick!==PC.tick){
      throw("adding wrong MovePack! tick: "+PC.tick+" PackTick: "+newPack.tick);
    }
    else if(PC[newPack.id]){
      throw("attempting to add MovePack id: "+newPack.id+" when this PackCollection already has one!");
    }
    else{
      PC.MovePacks[newPack.id]=newPack;
    }
  };
  ret.newPC=function(tick){
    var PC={tick:tick,MovePacks:{}};
    PC.MovePacks[this.PeerID]={
      id:this.PeerID,
      tick:tick,
      moves:[]};
    return PC;}.bind(ret);

  ret.setConnect(function(id){
    if((id)!=="Server"){
      console.log('connected! to '+id);
      //      if(!this.started){
      this.Players[id]={};
      //      }
      //      else{
      //        this.disconnect(id);
      //      }
    }
  }.bind(ret));
  ret.setDisconnect(function(id){
    //if(this.Players[id]){
    //ask server to reistablish connection!
    //delete this.Players[id];
    console.log("friend gone!");
    this.connect(id,10);
  }.bind(ret));
  ret.setRecv(function(id,data){
    this.tagFuncs.run(data);
  }.bind(ret));
  ret.Players={};
  ret.waiting=0;
  ret.tagFuncs=new tagFuncs();
  ret.waiting=0;
  ret.tick=0;
  ret.started=0;
  ret.RunFunc=RunFunc;
  ret.stallFunc=stallFunc;
  ret.tagFuncs.addFunc("_PC",function(data){
    //onRecv
    /*  depends on comm being recieved: 
     *  if it is for stateTime_t or less ignore 
     *  if it is for stateTime_t+1 write in currTick+1 
     *  if it is for stateTime_t+2, write in currTick+2 */
    var currTick=this.tick;
    var movesTick=data.PC.tick;
    //console.log("recv "+data.id+" currTick "+currTick+" movesTick "+movesTick);
    if(this.started){
      if(movesTick===currTick+1){ 
        //console.log(data);
        this.CombineCollections(this.MovesPlus1,data.PC); }
        else if(movesTick===currTick+2){ this.CombineCollections(this.MovesPlus2,data.PC); }
        else if(movesTick>currTick+2){ throw("recieved tick should never be from turn greater than curretick+2!, but this one is!"); }
    }
  }.bind(ret));
  ret.tagFuncs.addFunc("_StartGame",function(data){
    this.Players[this.PeerID]={};
    this.goConnections=data.ids;
    this.playerNum=data.playerNum;
      console.log("IDS:"+data.ids+" STEP:"+data.duration);
    for(var id in data.ids){
      if(id!==this.PeerID){ this.connect(id,10); }
    }
    //this.MovesPlus1.addMovePack(new MovePack(this.PeerID,1));
    //this.MovesPlus2.addMovePack(new MovePack(this.PeerID,2));
    this.Start(data.duration);
  }.bind(ret));
  //<

  //$ PEER FUNCTIONS
  ret.Start=function(Duration){
    var waitLoop=function(){
      var allOpened=true;
      for(var openedI in this.goConnections){
        var currConn=this.goConnections[openedI];
        if(currConn!=this.PeerID&&!this._Peers[currConn]){
          //console.log("waiting for peer "+this.PeerID+" to open connection");
          allOpened=false;
        }
      }
      if(!allOpened){
        setTimeout(waitLoop,1000);
      }
      else{
        console.log("connections open, starting game!");
        this.run=new flexInterval(this.DecideGo.bind(this),Duration,Date.now());
      }
    }.bind(this);
    waitLoop();
    //start as soon as all connections are opened!
    //this.run=accInterval(this.DecideGo.bind(this),Duration,startTime,this.stallFunc.bind(this));
    //this.run=new flexInterval(this.DecideGo.bind(this),Duration,startTime);
  };
  ret.moveCompareFunc=function(m1,m2){return m1-m2;};

  //  ret.addToSorted=function(MovePack){
  //  this.moveListTot=mergeSortedArr(this.moveListSorted,MovePack.moves,this.moveCompareFunc);
  //  };

  ret.CombineCollections=function(PC1,PC2){
    if(PC1.tick!==PC2.tick){
      throw("error, attempting to combine packs with different ticks!: "+PC1.tick+" "+PC2.tick);
    }
    else{
      for(var PackID in PC2.MovePacks){
        if(!PC1.MovePacks[PackID]){
          this.addMovePack(PC1,PC2.MovePacks[PackID]);
          //          if(addToSorted){
          //            this.addToSorted(PC2.MovePacks[PackID]);
          //            }
          if(this.waiting&&this.goCondition()){
            this.run.goNow();
          }
        }
      }
    }
  };

  ret.goCondition=function(){
    if(Object.keys(this.Players).length===Object.keys(this.MovesPlus1.MovePacks).length){
      return true;
    }
    return false;
  };

  ret.DecideGo=function(){
    //console.log(Object.keys(this.MovesPlus1.MovePacks));
    if(this.tick===0&&!this.started){
      this.started=1;
      ret.MovesPlus0=ret.newPC(0);
      ret.MovesPlus1=ret.newPC(1);
      ret.MovesPlus2=ret.newPC(2);
      //this.TakeCommsAndRunSim();
      //return;
    }
    if(this.goCondition()){
      this.TakeCommsAndRunSim();
    }
    else{
      for(var key in this.Players){
        if(!this.MovesPlus1.MovePacks[key]){
          //console.log("waiting on next tick from id "+key+" currTick "+this.tick);
          //console.log(this.MovesPlus1.MovePacks);
          //console.log(this.MovesPlus1.MovePacks[key]);
        }
        this.WaitAndSendOldMoves();
      }
    }
    /*  DecideGo!(oldMoves)
     * base on current state, decide whether or not to go, if something arrives midway that changes fate, that's totally cool!
     * advance state to t+1 */
  };

  ret.TakeCommsAndRunSim=function(){
    this.tick+=1;
    /*   Activate Keyboard
     *   callSendMoves(new)
     *   RunSim(applyOld) */
    this.waiting=0;
    this.SendMoves(true);
    this.RunFunc(this.PCtoList(this.MovesPlus0));
    //this.moveListSorted=[];
  };

  ret.PCtoList=function(PC){
    var ret=[];
    for(var Peerid in PC.MovePacks){
      var moves=PC.MovePacks[Peerid].moves;
      for(var iMove in moves){
        moves[iMove].id=Peerid
        ret.push(moves[iMove]);
      }
    }
    return ret;
  };

  ret.WaitAndSendOldMoves=function(){
    this.waiting=1;
    this.SendMoves(false);
  };

  ret.TakeMove=function(action){
    if(this.started){
      this.MovesPlus2.MovePacks[this.PeerID].moves.push(action);
    }
  };

  ret.SendMoves=function(newOrOld){
    //  if new, send, and old=new clear new! else send old
    if(newOrOld){
      for(var FriendID in this.Players){
        //console.log(this.Players);
        if(FriendID!=this.PeerID){
          //console.log("sending new moves "+this.MovesPlus2.tick+" currTick "+this.tick);
          this.send(FriendID,{tag:"_PC",PC:this.MovesPlus2});
        }
      }
      this.MovesPlus0=this.MovesPlus1;
      this.MovesPlus1=this.MovesPlus2;
      this.MovesPlus2=this.newPC(this.tick+2);
      //this.MovesPlus2.addMovePack(new MovePack(this.PeerID,this.tick+2));
    }
    else{
      for(var FriendID2 in this.Players){
        if(FriendID2!=this.PeerID){
          //console.log("sending old moves"+this.MovesPlus1.tick+ "currTick "+this.tick);
          //console.log(this.MovesPlus1);
          this.send(FriendID2,{tag:"_PC",PC:this.MovesPlus1});
          if(this.tick==1){
            this.send(FriendID2,{tag:"_PC",PC:this.MovesPlus0});
          }
        }
        //this.stallFunc();
      }
    }
  };
  return ret;

};
//<

if(typeof module!== 'undefined'){
  module.exports.LSPeer=LSPeer;
}
