/* FUNCTIONS
 * initState()
 * stateStep(actions,delay)
 * stateCheckSum() returns checksum of state for comparison
 * startTime time that client will start app
 * steps between updates and such.
 */

var Move=function(id,step,time,action){
  this.i=id;
  this.s=step;
  this.t=time;
  this.a=action;
};

var LSPeer=function(myPeer,stateStep,stateCheckSum,startTime,timeStep){
  this.waiting=0;
  this.numPeers=0;
  this.step=0;
  this.message={};
  this.gotFrom=[];
  this.setupMessages();
  this.allMoves=[];
  this._stateStep=stateStep;
  this._stateCheckSum=stateCheckSum;
  this._startTime=startTime;
  this._timeStep=timeStep;
  this._connectedIDs={};
  this._messages={};
  this._runFunc=function(){
  };
};

LSPeer.prototype=new PeerClient(function(id){
},function(id){
},function(id,data){},"192.168.1.2",8001);

LSPeer.prototype.sendActions=function(){
  if(waiting){
    for(var id in this._connectedIDs){
      this.send(id,this.prevActions);
    }
  }
};

//lockstepClient.prototype.setupMessages=function(){
//  this.prevMessage=this.message;
//  this.message={
//    step:this.step;
//    actions:[];
//    checksum:0;
//  };
//};
LSPeer.prototype.Act=function(actions){
  this.message.checksum=this._stateCheckSum();
  for(var peerID in this.connectedIDs){
    this.myPeer.send(peerID,this.message);
  }
  this.setupMessages();
  this.stateStep(this.allMoves);
};

LSPeer.prototype.takeAction=function(actionString){
};


//var testLockPeer=new PeerClient(
//  function(id){
//  console.log('new connection to '+id);
//  accurateInterval(console.log("HI!"),1000,Date.now()+5000);
//  if(id===1){
//    this.send(1,"hi");
//    this.disconnect(1);
//  }
//  if(id==='Server'){
//    if(this.PeerID===2){
//      this.connect(1);
//    }
//  }
//},function(id){
//  console.log("facing disconnect!");
//},function(id,data){
//  console.log('got something!');
//},"192.168.1.2",8001);
