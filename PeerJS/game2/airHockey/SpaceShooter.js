var KeyCounter=function(){
  this.keys={};
  this.addKey=function(keyNum,data){
    if(data){
      this.keys[keyNum]=data;
    }
    else{
      this.keys[keyNum]=1;
      if(keyNum=='W'){
        this.keys.s=0;
      }
      else if(keyNum=='S'){
        this.keys.w=0;
      }
      else if(keyNum=='D'){
        this.keys.a=0;
      }
      else if(keyNum=='A'){
        this.keys.d=0;
      }
    }
  };
  this.remKey=function(keyNum){
    this.keys[keyNum]=0;
  };
};

var PerimeterLocation=function(dims,rad,wallNum){
  //wallNum goes from 0 to 4, each whole number is a wall, each fraction is how far along the wall
  //order of walls: think... right down left up
  var ret=[0,0];
  var betterDims=[dims[0]-rad*2,dims[1]-rad*2];
  var wallPart=wallNum%1;
  if(wallNum<1){
    ret[0]=betterDims[0]*wallPart+rad;
    ret[1]=rad;
  }
  else if(wallNum<2){
    ret[0]=betterDims[0]+rad;
    ret[1]=betterDims[1]*wallPart+rad;
  }
  else if(wallNum<3){
    ret[0]=betterDims[0]*(1-wallPart)+rad;
    ret[1]=betterDims[1]+rad;
  }
  else if(wallNum<4){
    ret[0]=rad;
    ret[1]=betterDims[1]*(1-wallPart)+rad;
  }
  return ret;
};

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
  //default setup function
  this.world=new circWorld([10,10],this.dims,this.ctx,function(circ,square){
    //wall function
    if(square.terrain==="wall"){ return 0; }
    return 1;
  });
  this.world.keyCounter=new KeyCounter();

  for(var x=0;x<this.world.w;x++){
    for(var y=0;y<this.world.h;y++){
      if(y===8){ this.world.get([x,y]).terrain="wall"; 
      }
      else{this.world.get([x,y]).terrain="grass"; }
    }
  }


  //  this.hero1=new Circ("red",10,"unit",this.world);
  //  this.hero1.team='good';
  //  this.hero1.HP=100;
  //  this.hero1.addPhys([1,0]);
  //  this.hero1.enterWorld(this.world,[100,100]);
  //
  //  this.hero1.run=function(){
  //    this.runPhys(1);
  //    this.physMove();
  //  };

  //HERO CODE
  this.world.genHero=function(loc,color,speed,rad,HP){
    var ret=new Circ(color,rad,"hero",this);
    ret.addPhys();
    ret.enterWorld(this,loc);
    ret.MaxHP=HP;
    ret.speed=speed;
    ret.setup=function(){
      var keyCounter=this.world.keyCounter;
      var moveVec=[0,0];
      if(keyCounter.keys.W){moveVec[1]=-1;}
      if(keyCounter.keys.S){moveVec[1]=1;}
      if(keyCounter.keys.D){moveVec[0]=1;}
      if(keyCounter.keys.A){moveVec[0]=-1;}
      if(keyCounter.keys.shoot){this.world.genBullet(this.loc,'good',10,5,PtSub(this.loc,keyCounter.keys.shoot),'blue');
        keyCounter.remKey('shoot');
      }
      this.forceMagDir(this.speed,moveVec);
    };
    ret.run=function(){
      this.runPhys(1);
      this.physMove();
    };
    return ret;
  };

  //BULLET CODE
  this.world.genBullet=function(loc,team,speed,rad,dir,color,dmg){
    var ret=new Circ(color,rad,"bullet",this);
    ret.dir=norm(dir);
    ret.dmg=dmg;
    ret.speed=speed;
    ret.vel=ScalarMul(ret.dir,ret.speed*-1);
    ret.team=team;
    ret.setup=function(){
      if(this.team=='good'){
        var possibleColls=this.getColls(["enemy"]);
//        if(possibleColls.length){
//          var closestEnemy=
//        }
      }
    };
    ret.run=function(){
      if(!this.physMove()){
        this.die();
      }
    };
    ret.enterWorld(this,loc);
    return ret;
  };

  //ENEMY CODE
  this.world.genEnemy=function(loc,color,speed,rad,HP,aiFunc){
    var ret=new Circ(color,rad,"enemy",this);
    ret.addPhys();
    ret.enterWorld(this,loc);
    ret.MaxHP=HP;
    ret.HP=HP;
    ret.speed=speed;
    ret.aiFunc=aiFunc;
    ret.setup=function(){
      var movePlans=this.aiFunc();
      this.forceMagDir(movePlans.speed,movePlans.dir);
    };
    ret.run=function(){
      this.runPhys(1);
      this.physMove();
    };
    return ret;
  };

  this.chaserAI=function(){
    //get closest hero, and set controls to chase!
    var closestHero=this.world.circs.hero.getMax(function(vals){
      return -Distsq(vals.enemyLoc,this.loc);},[{enemyLoc:this.loc}]);
      return {dir:PtSub(closestHero.obj.loc,this.loc),speed:this.speed};
  };

  this.hero=this.world.genHero([100,100],"red",10,10,100);
  this.enemy=this.world.genEnemy([10,10],"blue",1,10,100,this.chaserAI);

  //run
  this.unitSetup=function(){
    this.setup();
  };
  this.unitRun=function(){
    this.run();
  };
  this.run=function(moves){
    for(var i=0;i<moves.length;i++){
      if(moves[i].t=="keyDown"){
        this.world.keyCounter.addKey(moves[i].a);
      }
      if(moves[i].t=="keyUp"){
        this.world.keyCounter.remKey(moves[i].a);
      }
      if(moves[i].t=="mouseDown"){
        this.world.keyCounter.addKey('shoot',moves[i].a);
      }
    }
    this.world.applyAllType('hero',this.unitSetup);
    this.world.applyAllType('enemy',this.unitSetup);
    this.world.applyAllType('bullet',this.unitSetup);
    this.world.applyAllType('hero',this.unitRun);
    this.world.applyAllType('enemy',this.unitRun);
    this.world.applyAllType('bullet',this.unitRun);
    //    this.world.applyAllType('unit',function(circ){
    //      circ.run();
    //    });
    //    if(this.heroDest){
    //      this.hero1.forceToPt(this.heroDest,2);
    //    }
    //    //this.world.move(this.hero1,[1,1]);
    //    for(var moveI in moves){
    //      this.heroDest=moves[moveI].a;
    //    }
    //    this.hero1.runPhys(1);
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

};

//run game
var myGame=new Game2d(new LSPeer(8001,function(moves){
  myGame.run(moves);
  myGame.draw();
}),1);


