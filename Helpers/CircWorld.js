var keyInputTaker=function(canv,peer){
  //take input
  this.takeKeyDown=function(event){
    peer.TakeMove('keyDown',String.fromCharCode(event.keyCode));
  };
  this.takeKeyUp=function(event){
    peer.TakeMove('keyUp',String.fromCharCode(event.keyCode));
  };
  this.takeMouseMove=function(event){
    var x=event.x-canv.offsetLeft;
    var y=event.y-canv.offsetTop;
    peer.TakeMove('mouseMove',[x,y]);
  };
  this.takeMouseDown=function(event){
    var x=event.x-canv.offsetLeft;
    var y=event.y-canv.offsetTop;
    peer.TakeMove('mouseDown',[x,y]);
  };
  this.takeMouseUp=function(event){
    var x=event.x-canv.offsetLeft;
    var y=event.y-canv.offsetTop;
    peer.TakeMove('mouseUp',[x,y]);
  };
  canv.addEventListener('mousemove',this.takeMouseMove,false);
  canv.addEventListener('mousedown',this.takeMouseDown,false);
  canv.addEventListener('mouseup',this.takeMouseUp,false);
  document.addEventListener('keydown',this.takeKeyDown,false);
  document.addEventListener('keyup',this.takeKeyUp,false);
};

var mag=function(cart){
  return Math.sqrt(cart[0]*cart[0]+cart[1]*cart[1]);
};

var norm=function(cart){
  if(cart[0]===0 && cart[1]===0){
    return [0,0];
  }
  var mag=Math.sqrt(cart[0]*cart[0]+cart[1]*cart[1]);
  return [cart[0]/mag,cart[1]/mag];
};

var dotProd=function(n1,n2){
  return n1[0]*n2[0]+n1[1]*n2[1];
};

var DiffVec=function(p1,p2){
  return [p2[0]-p1[0],p2[1]-p1[1]];
};

var Distsq=function(p1,p2){
  var diff=this.DiffVec(p1,p2);
  return diff[0]*diff[0]+diff[1]*diff[1];
};

var PtAdd=function(p1,p2){
  return [p1[0]+p2[0],p1[1]+p2[1]];
};
var PtSub=function(p1,p2){
  return [p1[0]-p2[0],p1[1]-p2[1]];
};

var ScalarMul=function(p,n){
  return [p[0]*n,p[1]*n];
};
var PtCopy=function(p){
  return [p[0],p[1]];
};


var drawDot=function(ctx,color,centerPt,rad){
  ctx.fillStyle=color;
  ctx.beginPath();
  ctx.arc(centerPt[0],centerPt[1],rad,0,2*Math.PI);
  ctx.fill();
  ctx.fillStyle="black";
  ctx.beginPath();
  ctx.arc(centerPt[0],centerPt[1],rad,0,2*Math.PI);
  ctx.stroke();
};

var drawRect=function(ctx,color,tl,size){
  ctx.fillStyle=color;
  ctx.fillRect(tl[0],tl[1],size[0],size[1]);
//  ctx.fillStyle="black";
//  ctx.rect(tl[0],tl[1],size[0],size[1]);
//  ctx.stroke();
};

var Circ=function(color,rad,type,myWorld){
  this.world=myWorld;
  if(this.rad>myWorld.ratioPixSquare[0]/2.0||this.rad>myWorld.ratioPixSquare[1]/2.0){
    throw "now u fucked up, a circ's Rad is > half the width and/or height of a square";
  }
  this.type=type;
  this.color=color;
  this.rad=rad;
  this.squareItem=undefined;
  this.WorldItem=undefined;
  this.loc=undefined;
};

Circ.prototype={
  draw:function(ctx){
    drawDot(ctx,this.color,this.loc,this.rad);
  },
  addPhys:function(initVel,initAcc){
    //init physics constants for circs that will be bouncing
    //will make circs move!!
    //exert force
    if(initVel){this.vel=initVel;}
    else{this.vel=[0,0];}
    if(initAcc){this.acc=initAcc;}
    else{this.acc=[0,0];}
  },
  forceToPt:function(pt,mag){
    var normXY=norm(normXY);
    this.applyForce([normXY[0]*mag,normXY[1]*mag]);
  },
  forceMagDir:function(mag,dir){
    var normDir=norm(dir);
    this.applyForce([normDir[0]*mag,normDir[1]*mag]);
  },
  applyForce:function(xycomp){
    this.acc[0]+=xycomp[0];
    this.acc[1]+=xycomp[1];
  },
  runPhys:function(friction){
    //friction ranges 0 to 1, higher = slower
    this.vel[0]=this.vel[0]*(1-friction);
    this.vel[1]=this.vel[1]*(1-friction);
    this.vel[0]+=this.acc[0];
    this.vel[1]+=this.acc[1];
    this.acc[0]=0;
    this.acc[1]=0;
  },
  physMove:function(){
    return this.world.move(this,this.vel);
  },
  teleport:function(nextLoc){
    var delta=PtSub(nextLoc,this.loc);
    return this.world.move(this,delta);
  },
  enterWorld:function(circWorld,loc){
    this.loc=loc;
    var myItems=circWorld.addWorld(this,loc);
    this.squareItem=myItems[0];
    this.WorldItem=myItems[1];
  },
  //displace:function(circWorld,physFn,delta,
  getMySquare:function(){
    return this.world.getfl(this.loc);
  },
  die:function(){
    this.squareItem.rem();
    this.WorldItem.rem();
  },
  getColls:function(types){
    return this.world.getTypesInRad(types,this.loc,this.rad);
  }
};

var typeList=function(type){
  var ret=new LL();
  ret.type=type;
  ret.add=function(circToAdd){
    if(circToAdd.type!=ret.type){ 
      throw "Inconsistent type to add: adding "+circToAdd.type+" to "+ret.type; 
    }
  return this.push(circToAdd);
  }.bind(ret);
return ret;
};

var circWorld=function(sqDims,dims,ctx,wallFn){
  this.circs={};
  this.squares=new Array(sqDims[0]*sqDims[1]);
  for(var i=0;i<sqDims[0]*sqDims[1];i++){
    this.squares[i]={};
  }
  this.sqDims=sqDims;
  this.ctx=ctx;
  this.dims=dims;
  this.ratioPixSquare=[this.dims[0]*1.0/this.sqDims[0],this.dims[1]*1.0/this.sqDims[1]];
  if(!wallFn){
    this.wallFn=function(circ,square){
      return 1;
    };
  }
  else{ this.wallFn=wallFn; }
  this.getTypeOnSquare=function(pt,type){
    var chosenSq=this.get(pt);
    if(chosenSq[type] && chosenSq[type].length){
    return this.circs[type];
    }
  };
  this.forceValidPt=function(OrigPt){
    var pt=PtCopy(OrigPt);
    if(pt[0]<0){ pt[0]=0.0001; }
    if(pt[0]>this.dims[0]){ pt[0]=this.dims[0]-0.0001; }
    if(pt[1]<0){ pt[1]=0.0001; }
    if(pt[1]>this.dims[1]){ pt[1]=this.dims[1]-0.0001; }
    return pt;
  };
  this.checkValidPt=function(pt){
    if(pt[0]<0||pt[1]<0||pt[0]>=this.dims[0]||pt[1]>=this.dims[1]){
      return 0;
    }
    return 1;
  };
  this.get=function(pt){
    if(!this.checkValidPt(pt)){
      throw "invalid pt lookup!"+str(pt);
    }
    return this.squares[pt[0]*this.sqDims[1]+pt[1]];
  };
  this.getLoc=function(pt){
    return [parseInt(pt[0]/this.ratioPixSquare[0]),parseInt(pt[1]/this.ratioPixSquare[1])];
  };
  this.getfl=function(pt){
    return this.get(this.getLoc(pt));
  };
  this.addSquare=function(circ,loc){
    if(this.checkValidPt(loc)){
      var addSquare=this.getfl(loc);
      circ.loc=loc;
      if(!addSquare[circ.type]){
        addSquare[circ.type]=new typeList(circ.type);
      }
      return addSquare[circ.type].push(circ);
    }
    else{throw "adding circ in improper location"+circ.loc;}
  }.bind(this);
  this.addWorld=function(circ,loc){
      if(!this.circs[circ.type]){
        this.circs[circ.type]=new typeList(circ.type);
      }
      return [this.addSquare(circ,loc),this.circs[circ.type].push(circ)];
  }.bind(this);
  this.move=function(circ,delta){
    var newLoc=PtAdd(circ.loc,delta);
      //[circ.loc[0]+delta[0],circ.loc[1]+delta[1]];
    if(this.checkValidPt(newLoc)){
      var oldCoords=this.getLoc(circ.loc);
      var newCoords=this.getLoc(newLoc);
      if(oldCoords[0] != newCoords[0] || oldCoords[1] != newCoords[1]){
        if(this.wallFn(circ,this.getfl(newLoc))){
          circ.loc=newLoc;
        circ.squareItem.rem();
        circ.squareItem=this.addSquare(circ,newLoc);
        return 1;
        }
        else{ return 0; }
      }
      else{
        circ.loc=newLoc;
        return 1;
      }
    }
    else{return 0;}
  };
  this.drawSquares=function(colorFn){
    for(var x=0;x<this.sqDims[0];x++){
      for(var y=0;y<this.sqDims[1];y++){
        var tl=[x*this.ratioPixSquare[0],y*this.ratioPixSquare[1]];
        drawRect(this.ctx,colorFn(this.get([x,y]),[x,y]),tl,[this.ratioPixSquare[0],this.ratioPixSquare[1]]);
      }
    }
  };
  this.withinRad=function(myLoc,myRad){
    if(Distsq(this.loc,myLoc)<(myRad+this.rad)*(myRad+this.rad)){
      return 1;
    }
    return 0;
  };
  this.getTypesInRad=function(types,myLoc,myRad){
    var ret={};
    if(typeof types =='string'){
      ret[types]=new LL();
    }
    else{
      for(var typeI in types){
        ret[types[typeI]]=new LL();
      }
    }
    var tl=this.getLoc(this.forceValidPt([myLoc[0]-myRad,myLoc[1]-myRad]));
    var br=this.getLoc(this.forceValidPt([myLoc[0]+myRad,myLoc[1]+myRad]));
    for(var x=tl[0];x<=br[0];x++){
      for(var y=tl[1];y<=br[1];y++){
        for(var type2 in ret){
          var SquareCircs=this.getTypeOnSquare([x,y],type2);
          if(SquareCircs){
            var addMe=SquareCircs.subArray(this.withinRad,[myLoc,myRad]);
            ret[type2]=ret[type2].concat(addMe);
          }
        }
      }
    }
    return ret;
  };
  this.applyAllType=function(type,fn,args){
    if(this.circs[type]){
      this.circs[type].apply(fn,args);
    }
  }.bind(this);
  this.drawType=function(type){
    if(this.circs[type]){
      this.circs[type].apply(function(ctx){
        this.draw(ctx);
      },[this.ctx]);
    }
    else{ throw "circWorld does not contain type "+type; }
  };
};
