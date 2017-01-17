"use strict";

window.addEventListener('DOMContentLoaded', function(){
  // get the canvas DOM element
  

    // create a built-in "sphere" shape its constructor takes 5 params: name, width, depth, subdivisions, scene
    //var sphere = BW.Mesh.CreateSphere('sphere1', 16, 2, scene)
    //var sphere = BW.Mesh.CreateBox('box', 2, scene,false,BW.Mesh.DEFAULTSIDE)
    //var plane=BW.Mesh.CreatePlane('myPlane',10,scene,false,BW.Mesh.DEFAULTSIDE)
    //var Lines= BW.Mesh.CreateLines("lines",[BW.V(-10,0,0),BW.V(10,0,0),BW.V(0,0,-10),BW.V(0,0,10)],scene)

    // move the sphere upward 1/2 of its height
    //sphere.position.y = 1

    // create a built-in "ground" shape its constructor takes the same 5 params as the sphere's one
    //var ground = BW.Mesh.Createground('ground1', 6, 6, 2, scene)

    // return the created scene

var Main=function(){
  this.count=0
}

Main.prototype.MakeBumpTex=function(scene){
  var ret=new BW.Texture("waterbump.jpg",scene)
  ret.level = 10; // the power of the texture
  ret.uScale = 3; // the Texture x scaling
  ret.vScale = 3; // the Texture y scaling
  ret.uAng = 3; // the Texture x angle
  ret.vAng = 3; // the Texture y angle
  ret.wAng = 1; // the Texture z angle
  ret.uOffset = 3; // the Texture x offset/shift
  ret.vOffset = 3; // the Texture y offset/shift
  ret.wrapU = 5; // inherited from baseTexture
  ret.wrapV = 5; // inherited from baseTexture
  return ret
}

//Main.prototype.QuadCopter=function(scene){
//  var ret=BW.QuickBox('copter',scene,new BW.V3(0,1,0))
//}

Main.prototype.InitScene=function(){
  //setting up scene
  this.canvas=document.getElementById('renderCanvas')
  var initScene=BW.QuickScene(this.canvas,new BW.C3(0.6,0.9,1),new BW.C3(0.1,0.1,0.1))
  this.scene=initScene.scene
  this.engine=initScene.engine
  this.physPlugin=initScene.physPlugin

  //setting up lights and camera
  this.camera=BW.QuickFlyCamera('cam1',this.scene,this.canvas,new BW.V3(0,5,-10),new BW.V3(0,0,0))
  this.light=BW.QuickLightDirectional('light1',this.scene,new BW.V3(0,-1,0),new BW.C3(0.5,0.5,0.5),new BW.C3(1,1,1))

  //setting up textures
  var bumpTex=this.MakeBumpTex(this.scene)
  var seaMat=BW.QuickColorMat("seaMat",this.scene,new BW.C3(0,0.8,1),new BW.C3(0,1,1),new BW.C3(0,0.1,0.1),null,null,0.5)
  seaMat.bumpTexture=bumpTex
  var BallMat=BW.QuickColorMat("BallMat",this.scene,new BW.C3(1,1,1),new BW.C3(1,1,1),new BW.C3(1,1,1))
  this.balls=[]
  for(var i=0;i<1;i++){
  this.balls.push(BW.QuickBall("ball"+i,this.scene,new BW.V3(Math.random()*100-50,1,Math.random()*100-50),1,5,BallMat.clone(),{mass:1,restitution:0.7,friction:0.1,nativeOptions:{belongsTo:1,collidesWith:1}}))
  }
  console.log(this.balls[0].physicsImposter)
    this.sea=BW.QuickPlane('sea',this.scene,null,new BW.V3(Math.PI/1.99,0,0),new BW.V3(400,400,1),seaMat,{mass:0,restitution:0.9,nativeOptions:{belongsTo:2,collidesWith:2}},true)
  initScene.Start()

  //click function
  var Pick=function(){
    var picked=this.scene.pick(this.scene.pointerX,this.scene.pointerY)
  if(picked.hit){
      console.log(picked)
      picked.pickedMesh.material.diffuseColor=new BW.C3(1,0,0)
    }
  }
  BW.ClickLockCamera(this.scene,this.canvas,Pick.bind(this))
}

Main.prototype.Run=function(){
  if(this.count===0){
  this.InitScene()
  }
  this.count+=1
}

var main=new Main()

  new LSPeer(8001,main.Run.bind(main))
})
