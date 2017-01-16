var Game2d=function(peer,lockstep,functions){
  //setup
  this.lockstep=lockstep;
  this.peer=peer;
  this.canv=document.getElementById("myCanvas");
  this.keyInputTaker=new keyInputTaker(this.canv,this.peer);
  this.ctx=this.canv.getContext("2d");
  this.dims=[];
  this.dims.push(this.canv.width);
  this.dims.push(this.canv.height);
  this.setupFun=function(){
    //default setup function
  this.sqDims=[10,10];
  this.world=new circWorld(10,10,this.dims,this.ctx,function(circ,square){
    //wall function
    console.log(square.terrain);
    if(square.terrain==="wall"){ return 0; }
    return 1;
  });
  for(var x=0;x<this.world.w;x++){
    for(var y=0;y<this.world.h;y++){
      if(y===8){ this.world.get([x,y]).terrain="wall"; 
      }
      else{this.world.get([x,y]).terrain="grass"; }
    }
  }
  this.hero1=new Circ("red",10,"unit",this.world);
  this.hero1.addPhys([1,0]);
  this.hero1.enterWorld(this.world,[100,100]);
  console.log(this);
  }.bind(this);
  console.log(this);
  //run
  this.run=function(moves){
    if(this.heroDest){
      this.hero1.forceToPt(this.heroDest,2);
    }
    //this.world.move(this.hero1,[1,1]);
    for(var moveI in moves){
      this.heroDest=moves[moveI].a;
    }
    this.hero1.runPhys(1);
  }.bind(this);

  //draw
  var debugDraw=function(square,loc){
    return "#00CC33";
  };
  this.draw=function(){
    //debug draw function!
    this.world.drawSquares(function(square,loc){ return "#00CC33"; });
    for(var type in this.world.circs){
      this.world.drawType(type);
    }
  }.bind(this);

  this.setupFun();
};


//run game
var myGame=new Game2d(new LSPeer(8001,function(moves){
  myGame.run(moves);
  myGame.draw();
}),1);
