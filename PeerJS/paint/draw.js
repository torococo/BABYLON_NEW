var Artist=function(){
  this.started=false;
  this.lastPos=[0,0];
};

// Attach the mousedown, mousemove and mouseup event listeners

// This painting tool works like a drawing
// pencil which tracks the mouse movements
var tool=function () {
  this.eventCounter=0;
  this.Artists={};
  this.canvas=document.getElementById("myCanvas");
  this.context=this.canvas.getContext("2d");

  // This is called when you start holding down the mouse button
  // This starts the pencil drawing
  //
  this.drawSegments=function(moves){
    this.eventCounter=0;
    for(var id in this.Peer.Players){
      if(!this.Artists[id]){
        this.Artists[id]=new Artist();
      }
      var drawer=this.Artists[id];
      for(var i=0;i<moves.length;i++){
        if(moves[i].id===id){
          if(moves[i].a.cmd==='mousedown'){
            drawer.started=true;
            drawer.lastPos=moves[i].a.loc;
          }
          else if(moves[i].a.cmd==='mouseup'){
            drawer.started=false;
          }
          else if(moves[i].a.cmd==='mousemove'){
            if(drawer.started){
              this.context.fillStyle='#000000';
              this.context.beginPath();
              this.context.moveTo(drawer.lastPos[0],drawer.lastPos[1]);
              drawer.lastPos=moves[i].a.loc;
              this.context.lineTo(drawer.lastPos[0],drawer.lastPos[1]);
              this.context.stroke();
            }
            else{
            drawer.lastPos=moves[i].a.loc;
            }
          }
        }
      }
    }
  }.bind(this);
  this.Peer=new LSPeer(8001,function(moves){this.drawSegments(moves);}.bind(this));
  this.mouseEvt = function (event) {
    this.Peer.TakeMove(this.eventCounter,{cmd:event.type,loc:[event.x-this.canvas.offsetLeft,event.y-this.canvas.offsetTop]});
    this.eventCounter+=1;
  }.bind(this);

  this.canvas.addEventListener('mousedown', this.mouseEvt, false);
  this.canvas.addEventListener('mousemove', this.mouseEvt, false);
  this.canvas.addEventListener('mouseup',	 this.mouseEvt, false);
};

var myTool=new tool();
