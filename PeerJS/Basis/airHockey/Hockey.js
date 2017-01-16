
var toPolar=function(cart){
  return [Math.sqrt(cart[0]*cart[0]+cart[1]*cart[1]),Math.atan2(cart[1],cart[0])];
};

var toCart=function(polar){
  return [Math.cos(polar[1])*polar[0],Math.sin(polar[1])*polar[0]];
};

var mag=function(cart){
  return Math.sqrt(cart[0]*cart[0]+cart[1]*cart[1]);
};

var norm=function(cart){
  var mag=Math.sqrt(cart[0]*cart[0]+cart[1]*cart[1]);
  return [cart[0]/mag,cart[1]/mag];
};

var dotProd=function(n1,n2){
  return n1[0]*n2[0]+n1[1]*n2[1];
};

var RTSGame=function(peer,lockstep){
  this.run=function(moves){
    console.log("running!");
  };
  this.dims=[];
  this.canv=document.getElementById("myCanvas");
  this.dims.push(this.canv.width);
  this.dims.push(this.canv.height);
  this.lockstep=lockstep;
  this.peer=peer;
  this.ctx=this.canv.getContext("2d");
  this.draw=function(){
//    this.ctx.fillStyle="#CCFFFF";
//    this.ctx.fillRect(0,0,this.dims[0],this.dims[1]);
//    this.ctx.fillStyle="#000000";
//    this.ctx.fillRect(0,this.dims[1]/2,this.dims[0],1);
//    this.ctx.beginPath();
//    this.ctx.arc(this.dims[0]/2,this.dims[1]/2,50,0,2*Math.PI);
//    this.ctx.stroke();
  }.bind(this);
  this.takeMouse=function(event){
    var x=event.x-this.canv.offsetLeft;
    var y=event.y-this.canv.offsetTop;
    this.peer.TakeMove('paddle',[x,y]);
  }.bind(this);
  this.canv.addEventListener('mousemove',this.takeMouse,false);
};

//download three.js from the giithub repo
//

var myGame=new RTSGame(new LSPeer(8001,function(moves){
  myGame.run(moves);
  myGame.run([]);
  myGame.run([]);
  myGame.run([]);
  myGame.draw();
}),1);
