"use strict";
//$ AGENTS

var Agent=function(rad,h,nTessellation,mat,HitEdge){
  this.h=h
  this.mat=mat
  this.rad=rad
  this.HitEdge=HitEdge
}

Agent.prototype.ToWorld=function(world,grid,x,y){
  this.world=world
  var scene=world.scene
  this.mesh=BW.QuickBall(scene,new BW.V3(x,this.h,y),this.rad,this.nTessellation,this.mat)
  this.mesh.isPickable=false
  grid.Add(this,x,y)
  
}

Agent.prototype.IsTouching=function(other){
  if(other===this){return false}
  return this.grid.TouchingCircle(other,this.x,this.y,this.rad,'rad')
}

Agent.prototype.IsNearby=function(other,radius){
  if(other===this){return false}
  return this.grid.TouchingCircle(other,this.x,this.y,radius,'rad')
}

Agent.prototype.GetTouching=function(grid,retList){
  this.grid.GetSquareOfRad(retList,this.x,this.y,this.rad+0.5,this.IsTouching.bind(this))
}

Agent.prototype.GetNearby=function(grid,retList,radius){
  this.grid.GetSquareOfRad(retList,this.x,this.y,radius,this.IsNearby.bind(this),radius)
}

Agent.prototype.Move=function(x,y){
  if(x>0&&x<this.world.x&&y>0&&y<this.world.y){
    this.mesh.position.x=x;
    this.mesh.position.z=y;
    this.grid.Move(this,x,y)
  }
  else if(this.HitEdge){ this.HitEdge(x,y) }
}

Agent.prototype.Die=function(){
  this.grid.Rem(this)
}

Agent.prototype.Step=function(){
  //do nothing by default
}
//<

//$ SPECIALIZED AGENTS
//agents have hp,dp for enemy team and enemy spells
//(rad,x,y,vx,vy,hp,iTeam,bUnit,spellDamage,unitDamage,lifeSpan,HitEdge)
var GameAgent=function(rad,vx,vy,hp,iTeam,bUnit,spellDamage,unitDamage,lifeSpan,HitEdge){
  this.bUnit=bUnit
  this.hp=hp
  this.iTeam=iTeam
  this.spellDamage=spellDamage
  this.unitDamage=unitDamage
  this.lifeSpan=lifeSpan
  this.vx=vx
  this.vy=vy
  this.HitEdge=HitEdge
}
//gets all touching enemies, a good first step
GameAgent.prototype.GetTouchingEnemies=function(bSpells,bUnits){
  var touchingSpells=[]
  var touchingUnits=[]
  if(bSpells){
    for(let i=0;i<this.world.nTeams;i++){
      if(i!==this.iTeam){
        this.GetTouching(this.world.teamSpellGrids[i],touchingSpells)
      }
    }
  }
  if(bUnits){
    for(let i=0;i<this.world.nTeams;i++){
      if(i!==this.iTeam){
        this.GetTouching(this.world.teamUnitGrids[i],touchingUnits)
      }
    }
  }
  return{spells:touchingSpells,units:touchingUnits}
}

//referse direction
GameAgent.prototype.DefaultUnitEdge=function(x,y){
  this.vx=-this.vx
  this.vy=-this.vy
}

//projectile is destroyed
GameAgent.prototype.DefaultProjectileEdge=function(x,y){
  this.Die()
}

//deal damage to all touching enemies
GameAgent.prototype.DefaultAttack=function(touchingEnemies){
  for(let i in touchingEnemies.touchingSpells){
    touchingEnemies.touchingSpells[i].hp-=this.spellDamage
  }
  for(let i in touchingEnemies.touchingUnits){
    touchingEnemies.touchingUnits[i].hp-=this.unitDamage
  }
}

GameAgent.prototype.MoveDie=function(){
  if(this.hp<=0){
    this.Die()
    return
  }
  this.Move(this.x+this.vx,this.y+this.vy)
}

GameAgent.prototype.Add=function(world,x,y){
  this.world=world
  if(this.bUnit){ world.teams[this.iTeam].units.Add(this,x,y) }
  else{this.world.teams[this.iTeam].spells.Add(this,x,y)}
}
GameAgent.prototype=new Agent(0,0,0,null,null)

GameAgent.prototype.CheckCollisions=function(){
  //GameAgents deal damage during collisions, then die if they are out of hp
  
}
//<

var Hero=function(hp,mp,team){
  this.hp=hp
  this.mp=mp
  this.team=team
}

Hero.prototype=new GameAgent(0.2,0,0,undefined,undefined,true,10,10,-1,GameAgent.DefaultUnitEdge)

Hero.prototype.StepCombat=function(){
  var moves=this.world.moves
  for(let i in moves){
    var move=moves[i]
//    if(move.id===this.iTeam){
      if(move.tag==='clicked'){
        var shootX=move.x-this.x
        var shootY=move.y-this.y
        var normF=BW.MathNormFactor(shootX,shootY)
        shootX*=normF
        shootY*=normF
        this.Shoot(shootX,shootY,move.buttons)
      }
//    }
  }
}

Hero.prototype.Shoot=function(x,y){
  var Fireball=new GameAgent()
}

var FireBall=function(x,y,vx,vy){}

//$WORLD
var World=function(){
  this.tick=0
}

World.prototype.QuickInit=function(x,y,nTeams){
  this.nTeams=nTeams
  this.teamUnitGrids=[]
  this.teamSpellGrids=[]
  this.teamUnitArrs=[]
  this.teamSpellArrs=[]
  for(var i=0;i<nTeams;i++){
    this.teamUnitGrids[i]=new AgentGridSimple()
    this.teamSpellGrids[i]=new AgentGridSimple()
    this.teamUnitArrs[i]=[]
    this.teamSpellArrs[i]=[]
  }
  this.x=x
  this.y=y
  this.inputManager=BW.InputManager()
  this.prefX=0
  this.prefY=0
  this.canvas=document.getElementById('renderCanvas')
  var initScene=BW.QuickSceneDefaults(this.canvas,false)
  this.scene=initScene.scene
  this.engine=initScene.engine

  var baseColor=BW.QuickColorMat(this.scene,new BW.C3(1,0,0),new BW.C3(1,1,1),null,new BW.C3(0.1,0.1,0.1))
  var base=BW.QuickPlane(this.scene,new BW.V3(0,-0.25,0),new BW.V3(Math.PI/2,0,0),new BW.V3(10,10,1),baseColor,null,true)
  base.isPickable=true
  var aMat=BW.QuickColorMat(this.scene,new BW.C3(1,0,0),new BW.C3(1,1,1),null,new BW.C3(0.1,0.1,0.1))
  var aMat2=BW.QuickColorMat(this.scene,new BW.C3(0,0,1),new BW.C3(1,1,1),null,new BW.C3(0.1,0.1,0.1))
  var a=new Agent(0.25,0.25,10,aMat)
  a.ToWorld(this,this.heroes,0.25,0.25)
  initScene.Start()
}

World.prototype.TeamsToArrs=function(){
  for(var iTeam in this.teams){
    this.teamUnitArrs[iTeam].length=0
    this.teamSpellArrs[iTeam].length=0
    this.teamUnitGrids[iTeam].All(this.teamUnitArrs[iTeam])
    this.teamSpellGrids[iTeam].All(this.teamSpellArrs[iTeam])
  }
}

World.prototype.Step=function(){
  this.TeamsToArrs()
  for(let i=0;i<this.nTeams;i++){
    let spells=this.teamSpellArrs[i]
    for(let j in spells){
      spells[j].StepCombat()
    }
    let units=this.teamUnitArrs[i]
    for(let j in units){
      units[j].StepCombat()
    }
  }
  for(let i=0;i<this.nTeams;i++){
    let spells=this.teamSpellArrs[i]
    for(let j in spells){
      spells[j].StepCleanup()
    }
    let units=this.teamUnitArrs[i]
    for(let j in units){
      units[j].StepCleanup()
    }
  }
}

World.prototype.SetDirPref=function(event){
  if(event.keyCode===115){
    this.prefY=-1
  }
  if(event.keyCode===119){
    this.prefY=1
  }
  if(event.keyCode===97){
    this.prefX=-1
  }
  if(event.keyCode===100){
    this.prefX=1
  }
}

World.prototype.SendMoves=function(){
  //left 0 right 2
  if(this.inputManager.mouseButtons[0]||this.inputManager.mouseButtons[1]||this.inputManager.mouseButtons[2]){
    var picked=this.scene.pick(this.inputManager.mouseX,this.inputManager.mouseY)
    if(picked.hit){
      this.peer.TakeMove({tag:'clicked',x:picked.pickedPoint.x,y:picked.pickedPoint.y,buttons:this.inputManager.mouseButtons})
    }
  }
  var xSend=0
  var ySend=0
  if(this.inputManager.keys[115]&&(this.prefY===1||!this.inputManager.keys[119])){
    ySend=-1
  }
  else if(this.inputManager.keys[119]&&(this.prefY===-1||!this.inputManager.keys[115])){
    ySend=1
  }
  if(this.inputManager.keys[97]&&(this.prefX===1||!this.inputManager.keys[100])){
    xSend=-1
  }
  else if(this.inputManager.keys[100]&&(this.prefX===-1||!this.inputManager.keys[97])){
    xSend=1
  }
  if(xSend!==0&&ySend!==0){
    xSend=xSend*0.7071
    ySend=ySend*0.7071
  }
  this.peer.TakeMove({tag:'move',x:xSend,y:ySend})
}

World.prototype.Step=function(moves){
  var Agents=[]
}
World.prototype.Run=function(moves){
  if(this.tick===0){this.Init(1,1)}
  this.Step(moves)
  this.tick+=1
}
window.addEventListener('DOMContentLoaded',function(){
  var w=new World()
  w.peer=new LSPeer(8001,w.Run.bind(w))
})

//<
