var Circle=function(rad,pos,color,name){
  this.rad=rad;
  this.color=color;
  this.pos=pos;
  this.name=name;
};

Circle.prototype={
  draw:function(ctx){
    ctx.fillStyle=this.color;
    ctx.beginPath();
    ctx.arc(this.pos[0],this.pos[1],this.rad,0,2*Math.PI);
    ctx.closePath();
    ctx.fill();
  },
};

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


var Puck=function(rad,pos,color,name){
  var ret=new Circle(rad,pos,color,name);
  ret.vel=[3,0];
  ret.hitP1=0;
  ret.hitP2=0;
  ret.move=function(dims){
    //var polarMag=toPolar(this.vel);
    //this.vel=toCart(polarMag);
    if(this.pos[0]+this.rad+this.vel[0]>dims[0]||this.pos[0]-this.rad+this.vel[0]<0){
      this.vel[0]=-this.vel[0];
    }
    if(this.pos[1]+this.rad+this.vel[1]>dims[1]||this.pos[1]-this.rad+this.vel[1]<0){
      this.vel[1]=-this.vel[1];
    }
    this.pos[0]+=this.vel[0];
    this.pos[1]+=this.vel[1];
  };
  ret.speedUp=function(acc){
    var myMag=mag(this.vel);
    if(myMag<20){
    var myNorm=norm(this.vel);
    var newMag=myMag+acc;
    this.vel=[myNorm[0]*newMag,myNorm[1]*newMag];
    }
  };
  ret.collisionFunc=function(circ){
    var collisionNormal=([this.pos[0]-circ.pos[0],this.pos[1]-circ.pos[1]]);
    var nCollisionNormal=norm(collisionNormal);
    var nVelVec=norm(this.vel);
    var velMag=mag(this.vel);
    var dotProduct=Math.abs(dotProd(nCollisionNormal,nVelVec));
    //console.log(dotProduct);
    this.vel=[dotProduct*nCollisionNormal[0]+(1-dotProduct)*nVelVec[0],dotProduct*nCollisionNormal[1]+(1-dotProduct)*nVelVec[1]];
    var newMag=mag(this.vel);
    this.vel=[this.vel[0]*(velMag/newMag),this.vel[1]*(velMag/newMag)];
  };
  ret.checkCollision=function(circ){
    if(circ.name!=='Puck'){
      var collRad=this.rad*this.rad+circ.rad*circ.rad;
      var distx=this.pos[0]-circ.pos[0];
      var disty=this.pos[1]-circ.pos[1];
      if(distx*distx+disty*disty<=collRad*2){
        if(circ.name=='p1Paddle'&&this.hitP1===0){
          this.hitP1=1;
          this.hitP2=0;
          this.collisionFunc(circ);
        }
        if(circ.name=='p2Paddle'&&this.hitP2===0){
          this.hitP2=1;
          this.hitP1=0;
          this.collisionFunc(circ);
        }
      }
      else if(circ.name=='p1Paddle'){
        this.hitP1=0;
      }
      else if(circ.name=='p2Paddle'){
        this.hitP2=0;
      }
    }
  };
  return ret;
};

var Goal=function(br,tl){
  this.br=br;
  this.tl=tl;
  this.lives=7;
  this.inGoal=0;
  this.withinGoal=function(loc){
    if(loc[0]>this.tl[0]&&loc[0]<this.br[0]&&loc[1]<this.tl[1]&&loc[1]>this.br[1]){
      //console.log("goal!");
      if(this.inGoal===0){
        this.lives-=1;
        this.inGoal=1;
      }
    }
    else{
    this.inGoal=0;
    }
  };
  this.draw=function(ctx){
    ctx.fillStyle='#FFCC00';
    ctx.fillRect(this.tl[0],this.tl[1],this.br[0]-this.tl[0],this.br[1]-this.tl[1]);
    ctx.font="15px Verdana";
    ctx.fillStyle='#000000';
    ctx.fillText('lives: '+this.lives,this.tl[0],this.tl[1]);
  };
};

var HockeyGame=function(peer,lockstep){
  this.lockstep=lockstep;
  this.peer=peer;
  this.objects={};
  this.canv=document.getElementById("myCanvas");
  this.dims=[];
  this.dims.push(this.canv.width);
  this.dims.push(this.canv.height);
  this.objects.p1Goal=new Goal([this.canv.width*7/10,this.canv.height-30],[this.canv.width*3/10,this.canv.height]);
  this.objects.p2Goal=new Goal([this.canv.width*7/10,0],[this.canv.width*3/10,30]);
  this.ctx=this.canv.getContext("2d");
  this.objects.Puck=new Puck(15,[this.dims[0]/2.0,this.dims[1]/2.0],"#000000","Puck");
  this.objects.p1Paddle=new Circle(20,[this.dims[0]/2.0,this.dims[1]-10],"#FF0000","p1Paddle");
  this.objects.p2Paddle=new Circle(20,[this.dims[0]/2.0,10],"#0000FF","p2Paddle");
  this.run=function(moves){
//    this.ctx.fillStyle="#FF0000";
//    this.ctx.moveTo(0,this.dims[1]/2);
//    this.ctx.lineTo(this.dims[0],this.dims[1]/2);
//    this.ctx.stroke();
//    this.ctx.beginPath();
//    this.ctx.arc(this.dims[0]/2,this.dims[1]/2,50,0,2*Math.PI);
//    this.ctx.closePath();
    for(var i=0;i<moves.length;i++){
      var currMove=moves[i];
      //console.log(currMove.a[0]+","+currMove.a[1]);
      if(currMove.id==1&&currMove.t==='paddle'){
        this.objects.p1Paddle.pos[0]=currMove.a[0];
        this.objects.p1Paddle.pos[1]=Math.max(currMove.a[1],this.dims[1]/2+20);

      }
      if(currMove.id==2&&currMove.t==='paddle'){
        this.objects.p2Paddle.pos[0]=currMove.a[0];
        this.objects.p2Paddle.pos[1]=currMove.a[1]=Math.min(currMove.a[1],this.dims[1]/2-20);
      }
      if(currMove.id!=this.peer.PeerID&&currMove.t==='puck'){
        this.nonLockstepLoc=currMove.a;
      }
    }
    this.objects.p1Goal.withinGoal(this.objects.Puck.pos);
    this.objects.p2Goal.withinGoal(this.objects.Puck.pos);
    if(this.lockstep||this.peer.PeerID===1){
    this.objects.Puck.checkCollision(this.objects.p1Paddle);
    this.objects.Puck.checkCollision(this.objects.p2Paddle);
    this.objects.Puck.move(this.dims);
    this.objects.Puck.speedUp(0.001);
    }
    if(!this.lockstep&&this.peer.PeerID===1){
      this.peer.TakeMove('puck',this.objects.Puck.pos);
    }
    if(this.nonLockstepLoc){
      this.objects.Puck.pos=this.nonLockstepLoc;
    }
    for(var objID in this.objects){
      this.objects[objID].draw(this.ctx);
    }
  }.bind(this);
  this.draw=function(){
    this.ctx.fillStyle="#CCFFFF";
    this.ctx.fillRect(0,0,this.dims[0],this.dims[1]);
    this.ctx.fillStyle="#000000";
    this.ctx.fillRect(0,this.dims[1]/2,this.dims[0],1);
    this.ctx.beginPath();
    this.ctx.arc(this.dims[0]/2,this.dims[1]/2,50,0,2*Math.PI);
    this.ctx.stroke();
    for(var objID in this.objects){
      this.objects[objID].draw(this.ctx);
    }
  };
  this.takeMouse=function(event){
    var x=event.x-this.canv.offsetLeft;
    var y=event.y-this.canv.offsetTop;
    this.peer.TakeMove('paddle',[x,y]);
  }.bind(this);
  this.canv.addEventListener('mousemove',this.takeMouse,false);
};

var myGame=new HockeyGame(new LSPeer(8001,function(moves){
  myGame.run(moves);
  myGame.run([]);
  myGame.run([]);
  myGame.run([]);
  myGame.draw();
  }),1);
