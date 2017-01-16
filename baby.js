"use strict"

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

Main.prototype.Run=function(){
  if(this.count===0){
//    this.qs=BW.QuickScene('renderCanvas')
//    this.canvas=document.getElementById('renderCanvas')
//    this.engine=new BW.Engine(this.canvas,true)
//    this.scene = new BABYLON.Scene(this.engine);
//    this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);
//    this.camera.setTarget(BABYLON.Vector3.Zero());
//    this.camera.attachControl(this.canvas, true);
//    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
//    light.intensity = 0.7;
//    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, this.scene);
//    sphere.position.y = 1;
//    var ground = BABYLON.Mesh.Createground("ground1", 6, 6, 2, this.scene);
//    this.engine.runRenderLoop(function(){this.scene.render()}.bind(this))

    this.qs=BW.QuickScene('renderCanvas')
    var scene=this.qs.scene
    scene.enablePhysics(new BW.V3(0,-10,0),new BW.OimoJSPlugin())
    var seaMat=BW.QuickColorMat("seaMat",scene,new BW.C3(0,0.4,0.4),new BW.C3(0,1,1),new BW.C3(0,0.1,0.1),null,null,0.5)
    seaMat.bumpTexture=this.MakeBumpTex(scene)
    var groundMat=BW.QuickColorMat("GroundMat",scene,new BW.C3(0.5,0.5,0),new BW.C3(1,1,1))
    var BallMat=BW.QuickColorMat("BallMat",scene,new BW.C3(1,0,0))

//    BW.QuickFog(scene,this.qs.camera,10,500)

//    var Sphere=BW.Mesh.CreateSphere('gravTest',16,2,scene)
//    this.Tube=BW.Mesh.CreateTube("tube",[BW.V(-10,0,0),BW.V(10,0,0)],1,10,null,BABYLON.Mesh.NO_CAP,this.qs.scene)
//    this.mat1=new BW.QuickMat("mat1",this.qs.scene,BW.C(0,0,0),BW.C(0,1,0),BW.C(0,0,1),BW.C(0,0,0));
    //this.Tube.material=this.mat1
    //this.ground=BW.Mesh.CreateGround('ground1',6,6,2,this.qs.scene)
    var worldScale=new BW.V3(400,1,400)
    var seaScale=new BW.V3(worldScale.x,worldScale.z,worldScale.y)
    this.ground=BW.Mesh.CreateGroundFromHeightMap('ground1',"worldHeightMap.jpg",1,1,250,-0.5,10,this.qs.scene,false)
    this.balls=[]
    for(var i=0;i<100;i++){
      this.balls.push(BW.QuickBall("ball"+i,scene,5,1,BallMat,new BW.V3(Math.random()*100-50,10,Math.random()*100-50),{mass:1,restitution:0.9}))
    }
    BW.InitMesh(this.ground,groundMat,null,null,worldScale,BW.PhysicsImpostor.HeightmapImpostor,{mass:1,restitution:0.9},scene)
    this.sea=BW.QuickPlane('sea',scene,null,new BW.V3(Math.PI/2,0,0),seaScale,seaMat,null,true)
    //this.sea=BW.Mesh.CreatePlane('sea',200,this.qs.scene,true,BW.Mesh.DOUBLESIDE)
    //BW.InitMesh(this.sea,seaMat,null,new BW.V3(Math.PI/2,0,0),new BW.V3(100,100,10))
    //var seaMat=BW.QuickMat('mat2',this.qs.scene,BW.C(0,0.2,0.2),BW.C(0.8,0.8,0.8),null,null,0.5,0.2)
//    var seaMat=BW.QuickMat('mat2',this.qs.scene,BW.C(1,1,1),BW.C(0.8,0.8,0.8),null,null,0.5,1)
  this.qs.StartRender()
    this.qs.SetResize()
    var Pick=function(){
      var picked=this.qs.scene.pick(this.qs.scene.pointerX,this.qs.scene.pointerY)
    if(picked.hit){
        picked.pickedMesh.material.diffuseColor=BW.C(1,1,1)
      }
    }
    BW.ClickLockCamera(this.qs.scene,this.qs.canvas,Pick.bind(this))
  }
  this.count+=1
}

var main=new Main()

  new LSPeer(8001,main.Run.bind(main))
})
