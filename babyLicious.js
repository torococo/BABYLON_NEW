"use strict";

//$ UNIT
var Unit=function(){
}
//<

//$WORLD
var World=function(){
  this.tick=0
}

World.prototype.QuickInit=function(x,y,nTeams){
  this.x=x
  this.y=y
  this.grids={}
  this.inputManager=BW.InputManager2D()
  this.canvas=document.getElementById('renderCanvas')
  var initScene=BW.QuickSceneDefaults(this.canvas,false)
  this.scene=initScene.scene
  this.engine=initScene.engine
  var baseColor=BW.QuickColorMat(this.scene,new BW.C3(1,0,0),new BW.C3(1,1,1),null,new BW.C3(0.1,0.1,0.1)) 
  var base=BW.QuickPlane(this.scene,new BW.V3(0,-0.25,0),new BW.V3(Math.PI/2,0,0),new BW.V3(10,10,1),baseColor,null,true)
  base.isPickable=true
  var aMat=BW.QuickColorMat(this.scene,new BW.C3(1,0,0),new BW.C3(1,1,1),null,new BW.C3(0.1,0.1,0.1))
  var aMat2=BW.QuickColorMat(this.scene,new BW.C3(0,0,1),new BW.C3(1,1,1),null,new BW.C3(0.1,0.1,0.1))
  initScene.Start()
  this.AddGrid('home')
  this.AddThing({},10,0,0,1,0,0,'home',aMat)
}

World.prototype.ThingsToArr=function(){
  var things=[]
  var keys=Object.keys(this.grids)
  for(var i=0;i<keys.length;i++){
    var g=this.grids[keys[i]]
    things.push()
    g.All(things)
  }
  BW.Shuffle(things)
  return things
}

World.prototype.AddGrid=function(sGrid){
  this.grids[sGrid]=new AgentGridSimple()
}

//(obj,hp,x,y,r,vx,vy,sGrid,mat)
World.prototype.AddThing=function(obj,hp,x,y,r,vx,vy,sGrid,mat){
  this.grids[sGrid].Add(obj,x,y)
  obj.hp=hp
  obj.r=r
  obj.vx=vx
  obj.vy=vy
  obj.sGrid=sGrid
  obj.mat=mat
  obj.mesh=BW.QuickCylinder(this.scene,new BW.V3(x,0,y),undefined,r,1,10,mat)
}

World.prototype.Move=function(obj){
  this.grids[obj.sGrid].Move(obj,obj.vx,obj.vy)
  obj.mesh.position.x=obj.x
  obj.mesh.position.z=obj.y
  BW.Pr(obj.x)
}

World.prototype.KillThings=function(things,DeathFun){
  for(var t in things){
    if(t.hp!==undefined&&t.hp<=0){
      this.grids[t.sGrid].Rem(t)
      if(DeathFun){DeathFun(t)}
    }
  }
}

World.prototype.SendMoves=function(){
  //left 0 right 2
  var ret={tag:'actions'}
  if(this.inputManager.mouseButtons[0]||this.inputManager.mouseButtons[1]||this.inputManager.mouseButtons[2]){
    var picked=this.scene.pick(this.inputManager.mouseX,this.inputManager.mouseY)
    if(picked.hit){
      ret.xPick=picked.pickedPoint.x
      ret.yPick=picked.pickedPoint.y
      ret.buttons=this.inputManager.mouseButtons
    }
  }
  var direction=this.inputManager.GetMoveDir()
  ret.x=direction.x
  ret.y=direction.y
  this.peer.TakeMove(ret)
}

World.prototype.Step=function(moves){
  var move=moves[0]
  var ts=this.ThingsToArr()
  if(move&&(move.x!==0||move.y!==0)){
    for(var t in ts){
      t.vx=move.x*0.01
      t.vy=move.y*0.01
      this.Move(t)
    }
  }
  this.SendMoves()
}
World.prototype.Run=function(moves){
  if(this.tick===0){this.QuickInit(1,1)}
  this.Step(moves)
  this.tick+=1
}
window.addEventListener('DOMContentLoaded',function(){
  var w=new World()
  w.peer=new LSPeer(8001,w.Run.bind(w))
})

//<
