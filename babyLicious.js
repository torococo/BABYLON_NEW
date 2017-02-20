"use strict";

var Unit=function(r,g,b,type){
  this.color={diffuse:new BW.C3(r,g,b),specular:new BW.C3(1,1,1),emissive:new BW.C3(r*0.1,g*0.1,b*0.1)}
  this.type=type
}

Unit.prototype.AddCylinder=function(world){
  this.mat=new BW.QuickColorMat(world.scene,this.color.diffuse,this.color.specular,undefined,this.color.emissive)
  this.mesh=BW.QuickCylinder(world.scene,new BW.V3(this.x,0,this.y),undefined,this.r,1,10,this.mat)
  this.mesh.isPickable=false
}

Unit.prototype.MoveMesh=function(world,bAllowed){
  if(bAllowed){
    this.mesh.position.x=this.x
    this.mesh.position.z=this.y
  }
  else{
    if(this.type==='proj'){
        this.hp=0
      }
  }
}

Unit.prototype.Shoot=function(world,xShoot,yShoot,vel){
  xShoot-=this.x
  yShoot-=this.y
  var norm=BW.NormF(xShoot,yShoot)
  xShoot*=norm*vel
  yShoot*=norm*vel
  world.AddThing(new Unit(0,0,1,'hproj'),1,this.x,this.y,0.1,'hprojs',Unit.prototype.AddCylinder,Unit.prototype.MoveMesh,xShoot,yShoot)

}

//$WORLD
//
var World=function(){
  var ret=new World2D(10,10)

  ret.Step=function(moves){
    var move=moves[0]
    var ts=this.AllThings()
    if(move&&(move.x!==0||move.y!==0)){
      for(var it in ts){
        var t=ts[it]
        if(t.sGrid==='heroes'){
          t.vx=move.x*0.1
          t.vy=move.y*0.1
          if(move.xPick&&move.buttons[0]){
            t.Shoot(this,move.xPick,move.yPick,1)
          }
        }
        this.Move(t)
      }
    }
    this.SendMoves()
  }
  
  ret.Init=function(){
    this.QuickInit(document.getElementById("renderCanvas"))
    this.AddGround(new BW.QuickColorMat(this.scene,new BW.C3(0.1,0.4,0),new BW.C3(1,1,1),undefined,new BW.C3(0.1,0.1,0.1)))
    this.AddGrid('heroes')
    this.AddGrid('hprojs')
    this.unit=new Unit(1,0,0,'hero')
    this.AddThing(this.unit,10,5,5,0.4,'heroes',Unit.prototype.AddCylinder,Unit.prototype.MoveMesh)
  }

  ret.Run=function(moves){
    if(this.tick===0){
      this.Init()
    }
    this.Step(moves)
    this.tick+=1
  }

  return ret
}

window.addEventListener('DOMContentLoaded',function(){
  var w=new World()
  w.peer=new LSPeer(8001,w.Run.bind(w))
})

//
