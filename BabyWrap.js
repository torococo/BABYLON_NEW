"use strict";

//BABYLON RELATED
//$ FUNCTION SHORTHANDS
var BW=BABYLON

BW.Err=console.error
BW.Pr=console.log

//x,y
BW.V2=BW.Vector2
//x,y,z
BW.V3=BW.Vector3
//x,y,z,w
BW.V4=BW.Vector4

//r,g,b
BW.C3=BW.Color3
//r,g,b,a
BW.C4=BW.Color4
//<

//$ CAMERA FUNCTIONS
//creates a wsda controlled camera
BW.QuickFlyCamera=function(sName,scene,canvas,vPos,vTarget){
  var ret=new BW.FreeCamera(sName,vPos,scene)
  ret.keysUp.push(87)
  ret.keysDown.push(83)
  ret.keysLeft.push(65)
  ret.keysRight.push(68)
  ret.setTarget(vTarget)
//  ret.attachControl(canvas,false)
  return ret
}

//causes the mouse to toggle between locked and unlocked
BW.ClickLockCamera=function(scene,canvas,ClickResponse){
  scene.bIsLocked=false;
	scene.onPointerDown = function (evt) {
		//true/false check if we're locked, faster than checking pointerlock on each single click.
		if(!this.bIsLocked) {
			canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
			if(canvas.requestPointerLock) {
				canvas.requestPointerLock();
			}
		}
    else if(ClickResponse){ ClickResponse(evt) }
  }

	var PointerLockChange=function(){
	var controlEnabled = document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || document.pointerLockElement || null;
		if(!controlEnabled) {
			this.bIsLocked = false
		} 
    else {
			this.bIsLocked = true
		}
	}

	document.addEventListener("pointerlockchange", PointerLockChange.bind(scene), false)
	document.addEventListener("mspointerlockchange", PointerLockChange.bind(scene), false)
	document.addEventListener("mozpointerlockchange", PointerLockChange.bind(scene), false)
	document.addEventListener("webkitpointerlockchange", PointerLockChange.bind(scene), false)
}

//impose maximum view distance on the camera, with fadeout to fog BW.QuickFog=function(scene,min,max){
BW.QuickFog=function(scene,camera,nMin,nMax){
  scene.fogMode=BW.Scene._FOGMODE_LINEAR
  scene.fogStart=nMin
  scene.fogEnd=nMax
  camera.maxZ=nMax
}
//<

//$ SCENE FUNCTIONS
//creates default scene, with no meshes
BW.BasicScene=function(canvas,bPhysics){
  var ret={}
  ret.engine=new BW.Engine(canvas,true)
  ret.scene = new BW.Scene(ret.engine);
  ret.camera = new BW.FreeCamera("camera1", new BW.Vector3(0, 5, -10), ret.scene);
  ret.camera.setTarget(BW.Vector3.Zero());
//  ret.camera.attachControl(ret.canvas, true);
  ret.light = new BW.HemisphericLight("light1", new BW.Vector3(0, 1, 0), ret.scene);
  ret.light.intensity = 0.7;
  var sphere = BW.Mesh.CreateSphere("sphere1", 16, 2, ret.scene);
  sphere.position.y = 1;
  ret.ground = BW.Mesh.CreateGround("ground1", 6, 6, 2, ret.scene);
  ret.engine.runRenderLoop(function(){this.scene.render()}.bind(ret))
  return ret
}
BW.QuickSceneDefaults=function(canvas,bPhysics){
  var ret={}
  ret.engine=new BW.Engine(canvas,true)
  ret.scene=new BW.Scene(ret.engine)
  ret.scene.clearColor=new BW.C3(0,0,0)
  ret.scene.ambientColor=new BW.C3(1,1,1)
  ret.camera=BW.QuickFlyCamera('camera1',ret.scene,canvas,new BW.V3(0,5,0),new BW.V3(0,0,0))
  ret.light=new BW.HemisphericLight('light1',new BW.V3(0,1,0),ret.scene)
  ret.Start=function(){ret.engine.runRenderLoop(function(){ret.scene.render()}.bind(ret))}
  window.addEventListener('resize',ret.engine.resize.bind(ret.engine))
  if(bPhysics){
  ret.physPlugin=new BW.OimoJSPlugin()
  ret.scene.enablePhysics(new BW.V3(0,-10,0),ret.physPlugin)
  }
  //ret.SetResize=function(){window.addEventListener('resize',function(){ ret.engine.resize()})}
  return ret
}

//(canvas,cSky,cAmbient,bPhysics)
BW.QuickScene=function(canvas,cSky,cAmbient,bPhysics){
  var ret={}
  ret.engine=new BW.Engine(canvas,true,null,false)
  ret.scene=new BW.Scene(ret.engine)
  if(cSky){ ret.scene.clearColor=cSky }
  if(cAmbient){ret.scene.ambientColor=cAmbient}
  ret.Start=function(){ret.engine.runRenderLoop(function(){ret.scene.render()}.bind(ret))}
  window.addEventListener('resize',ret.engine.resize.bind(ret.engine))
  if(bPhysics){
    ret.physPlugin=new BW.OimoJSPlugin()
    ret.scene.enablePhysics(new BW.V3(0,-10,0),ret.physPlugin)
  }
  //ret.SetResize=function(){window.addEventListener('resize',function(){ ret.engine.resize()})}
  return ret
}
//<

//$ LIGHT FUNCTIONS
//(sName,scene,vDiffuse,vSpecular,vPosition)
BW.QuickLightPoint=function(scene,vPosition,cDiffuse,cSpecular,sName){
  var ret=new BW.PointLight(sName,vPosition,scene)
  if(cDiffuse){ret.diffuse=cDiffuse}
  if(cSpecular){ret.specular=cSpecular}
  return ret
}

//(sName,scene,vPosition,cDiffuse,cSpecular,cGroundColor)
BW.QuickLightHemispheric=function(scene,vPosition,cDiffuse,cSpecular,cGroundColor,sName){
  var ret=new BW.HemisphericLight(sName,vPosition,scene)
  if(cDiffuse){ret.diffuse=cDiffuse}
  if(cSpecular){ret.specular=cSpecular}
  if(cGroundColor){ret.groundColor=cGroundColor}
  return ret
}

//(sName,scene,vPosition,vDirection,nAngle,nExponent,cDiffuse,cSpecular)
BW.QuickLightSpot=function(scene,vPosition,vDirection,nAngle,nExponent,cDiffuse,cSpecular,sName){
  var ret=BW.SpotLight(sName,vPosition,vDirection,nAngle,nExponent)
  if(cDiffuse){ret.diffuse=cDiffuse}
  if(cSpecular){ret.specular=cSpecular}
  return ret
}

//(sName,scene,vDirection,cDiffuse,cSpecular)
BW.QuickLightDirectional=function(scene,vDirection,cDiffuse,cSpecular,sName){
  var ret=new BW.DirectionalLight(sName,vDirection,scene)
  if(cDiffuse){ret.diffuse=cDiffuse}
  if(cSpecular){ret.specular=cSpecular}
  return ret
}
//<

//$ MESH FUNCTIONS
//creates a material with all the coloring information filled in
BW.QuickColorMat=function(scene,cDiffuse,cSpecular,cAmbient,cEmissive,nSpecPower,nAlpha,sName){
  var ret=new BW.StandardMaterial(sName,scene)
  if(cDiffuse){ret.diffuseColor=cDiffuse}
  if(cSpecular){ret.specularColor=cSpecular}
  if(cAmbient){ret.ambientColor=cAmbient}
  if(cEmissive){ret.emissiveColor=cEmissive}
  if(nSpecPower){ret.specularColor=nSpecPower}
  if(nAlpha){ret.alpha=nAlpha}
  return ret
}
//otherwise use rotate, translate, scale functions, with BW.Space.LOCAL or BW.Space.WORLD
BW.InitMesh=function(mesh,material,vPosition,vRotation,vScaling,physicsImposter,imposterArgs,scene){
  if(vPosition){ mesh.position=vPosition }
  if(vRotation){ mesh.rotation=vRotation }
  if(vScaling){ mesh.scaling=vScaling }
  if(material){ mesh.material=material }
  if(physicsImposter){ mesh.setPhysicsState(physicsImposter,imposterArgs,scene)}
}

//(sName,scene,nSubdivisions,nRadius,material,vPosition,imposterArgs)
BW.QuickBall=function(scene,vPosition,nRadius,nTessellation,material,imposterArgs,sName){
  var ret=BW.Mesh.CreateSphere(sName,nTessellation,nRadius*2,scene)
  if(material){ret.material=material}
  if(vPosition){ret.position=vPosition}
  if(imposterArgs){ret.physicsImposter=new BW.PhysicsImpostor(ret,BW.PhysicsImpostor.SphereImpostor,imposterArgs,scene)}
  return ret
}

//(sName,scene,vPosition,vRotation,nRadius,nHeight,nTessellation,material,imposterArgs)
BW.QuickCylinder=function(scene,vPosition,vRotation,nRadius,nHeight,nTessellation,material,imposterArgs,sName){
  var diam=nRadius*2
  var ret=BW.Mesh.CreateCylinder(sName,nHeight,diam,diam,nTessellation,scene)
  if(vPosition){ret.position=vPosition}
  if(vRotation){ret.rotation=vRotation}
  if(material){ret.material=material}
  if(imposterArgs){ret.physicsImpostor=new BW.PhysicsImpostor(ret,BW.PhysicsImpostor.CylinderImpostor,imposterArgs,scene)}
  return ret
}

//(sName,scene,vPosition,vRotation,vScaling,material,imposterArgs)
BW.QuickBox=function(scene,vPosition,vRotation,vScaling,material,imposterArgs,sName){
  var ret=BW.Mesh.CreateBox(sName,1,scene,false)
  if(vPosition){ret.position=vPosition}
  if(vRotation){ret.rotation=vRotation}
  if(vScaling){ret.scaling=vScaling}
  if(material){ret.material=material}
  if(imposterArgs){ret.physicsImpostor=new BW.PhysicsImpostor(ret,BW.PhysicsImpostor.BoxImpostor,imposterArgs,scene)}
  return ret
}

//(sName,scene,vPosition,vRotation,vScaling,material,imposterArgs,bDoubleSided)
BW.QuickPlane=function(scene,vPosition,vRotation,vScaling,material,imposterArgs,bDoubleSided,sName){
  var sided=bDoubleSided?BW.Mesh.DOUBLESIDE:BW.Mesh.DEFAULTSIDE
  var ret=BW.Mesh.CreatePlane(sName,1,scene,false,sided)
  if(vPosition){ret.position=vPosition}
  if(vRotation){ret.rotation=vRotation}
  if(vScaling){ret.scaling=vScaling}
  if(material){ret.material=material}
  if(imposterArgs){ret.physicsImpostor=new BW.PhysicsImpostor(ret,BW.PhysicsImpostor.PlaneImpostor,imposterArgs,scene)}
  return ret
}

//BW.QuickPlane=function(sName,nCorner1,nCorner2,nPointOnPlane,)

//<

//$ SPRITE FACTORY

//(sName,scene,sImgURL,iCapacity,iSize)
BW.SpriteType=function(sName,scene,sImgURL,iCapacity,iSize){
  var ret=new BW.SpriteManager(sName,sImgURL,iCapacity,iSize,scene)
  return ret;
}

//(sName,scene,vPosition,vRotation,vScaling,spriteType,bPickable)
BW.GenSprite=function(sName,scene,vPosition,vRotation,vScaling,spriteType,bPickable,bInverted){
  var ret=new BW.Sprite(sName,spriteType)
  if(vPosition){ret.position=vPosition}
  if(vRotation){ret.rotation=vRotation}
  if(vScaling){ret.scaling=vScaling}
  if(bPickable){ret.isPickable=true}
  if(bInverted){ret.invertU=-1}
  return ret
}

//<


//NOT BABYLON RELATED

//$ AGENT GRID SIMPLE
var AgentGridSimple=function(){
  //agents are stored at 'x,y' indices, accessed by dictionary lookup
}

AgentGridSimple.prototype.Add=function(obj,x,y){
  var coords=this._ToCoords(x,y)
  obj._AgentGridSimpleCoords=coords
  obj.x=x
  obj.y=y
  var atLoc=this[coords]
  obj._AgentGridSimplePrev=undefined
  obj._AgentGridSimpleNext=atLoc
  this[coords]=obj
  if(atLoc!==undefined){
    atLoc._AgentGridSimplePrev=obj
  }
}

AgentGridSimple.prototype._ToCoords=function(x,y){
  return Math.floor(x)+","+Math.floor(y)
}

AgentGridSimple.prototype.Rem=function(obj){
  var objCoords=obj._AgentGridSimpleCoords
  var objNext=obj._AgentGridSimpleNext
  var objPrev=obj._AgentGridSimplePrev
  var atLoc=this[objCoords]

  if(atLoc===obj){
    //deal with case where obj is first in linkedlist
    if(objNext===undefined){
      delete this[objCoords]
    }
    else{
      this[objCoords]=objNext
    }
  }
  if(objNext){
    objNext._AgentGridSimplePrev=objPrev
  }
  if(objPrev){
    objPrev._AgentGridSimpleNext=objNext
  }
}

AgentGridSimple.prototype.Move=function(obj,x,y){
  var newCoords=this._ToCoords(x,y)
  if(newCoords!==obj._AgentGridSimpleCoords){
    this.Rem(obj)
    this.Add(obj,x,y)
  }
  obj.x=x
  obj.y=y
}

AgentGridSimple.prototype.GetSquare=function(retList,x,y,Condition,condArgs){
  //x and y are interpreted as coordinates
  var coords=this._ToCoords(x,y)
  var obj=this[coords]
  while(obj!==undefined){
    if(!Condition||Condition(obj,condArgs)){
      retList.push(obj)
    }
    obj=obj._AgentGridSimpleNext
  }
}

AgentGridSimple.prototype.GetSquareOfRad=function(retList,x,y,radius,Condition,condArg){
  for(var i=Math.floor(x-radius);i<x+radius;i++){
    for(var j=Math.floor(y-radius);j<y+radius;j++){
      this.GetSquare(retList,i,j,Condition,condArg)
    }
  }
}

AgentGridSimple.prototype.GetRect=function(retList,x1,y1,x2,y2,Condition,condArg){
  var inArgs=[x1,y1,x2,y2]
  for(var x=Math.floor(x1);x>x2;x++){
    for(var y=Math.floor(y1);y<y2;y++){
      this.GetSquare(retList,x,y,Condition,condArg)
    }
  }
}

AgentGridSimple.prototype._GetSquareCoords=function(retList,coords){
  var obj=this[coords]
  while(obj!==undefined){
    retList.push(obj)
    obj=obj._AgentGridSimpleNext
  }
}

AgentGridSimple.prototype.TouchingRect=function(obj,x1,y1,x2,y2,sRadX,sRadY){
  return obj.x+obj[sRadX]>x1&&obj.x-obj[sRadX]<x2&&obj.y+obj[sRadY]>y1&&obj.y-obj[sRadY]<y2
}

AgentGridSimple.prototype.TouchingCircle=function(obj,x,y,radius,sRad){
  var totRad=radius+obj[sRad]
  var distSq=totRad*totRad
  var xComp=obj.x-x
  var yComp=obj.y-y
  var distSqAcutal=xComp*xComp+yComp*yComp
  return distSq>=distSqAcutal
}

AgentGridSimple.prototype.InRect=function(obj,coords){
  return obj.x>coords[0]&&obj.x<coords[2]&&obj.y>coords[1]&&obj.y<coords[3]
}

AgentGridSimple.prototype.InCircle=function(obj,pointAndDistSq){
  var xComp=obj.x-pointAndDistSq.x
  var yComp=obj.y-pointAndDistSq.y
  var distSq=xComp*xComp+yComp*yComp
  return pointAndDistSq.distSq>=distSq
}

AgentGridSimple.prototype.All=function(retList){
  var keys=Object.keys(this)
  for(var i=0;i<keys.length;i++){
    this._GetSquareCoords(retList,keys[i])
  }
}

AgentGridSimple.prototype.AllShuffle=function(retList){
  this.All(retList)
  BW.Shuffle(retList)
}

//<

//$ UTILS
BW.Shuffle=function(arr){
  for (let i = arr.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
  }
}

//use this.scene.pick(scene.pointerX,scene.pointerY) to get clicked object and coords
//use ispickable to setup
BW.InputManager=function(KeyDown,KeyUp,MouseDown,MouseUp,MouseMove){
  var ret={
    keys:[],
    mouseButtons:[],
    mouseX:undefined,
    mouseY:undefined,
    KeyUp:KeyUp,
    KeyDown:KeyDown,
    MouseDown:MouseDown,
    MouseUp:MouseUp,
    MouseMove:MouseMove
  }
  ret.keys.length=128
  ret.mouseButtons.length=3
  document.addEventListener('mousedown',function(event){
    BW.Pr(event.button)
    this.mouseButtons[event.button]=true
    this.mouseX=event.clientX
    this.mouseY=event.clientY
    if(this.MouseDown){this.MouseDown(event)}
  }.bind(ret),false) 
  document.addEventListener('mouseup',function(event){
    this.mouseButtons[event.button]=undefined
    this.mouseX=event.clientX
    this.mouseY=event.clientY
    if(this.MouseUp){this.MouseUp(event)}
  }.bind(ret),false) 
  document.addEventListener('mousemove',function(event){
    this.mouseX=event.clientX
    this.mouseY=event.clientY
    if(this.MouseMove){this.MouseMove(event)}
  }.bind(ret),false) 
  document.addEventListener('keydown',function(event){
    this.keys[event.keyCode]=true
    if(this.KeyDown){this.KeyDown(event)}
  }.bind(ret),false) 
  document.addEventListener('keyup',function(event){
    this.keys[event.keyCode]=undefined
    if(this.KeyUp){this.KeyUp(event)}
  }.bind(ret),false) 
  return ret
}

//gets the factor that all arguments should be divided by to normalize
BW.NormF=function(){
  var sum=0
  for(let i in arguments){
    sum+=arguments[i]*arguments[i]
  }
  return 1/Math.sqrt(sum)
}

//<


//FROM OUTSIDE

//$ HEAP
BW.Heap=function(scoreFunction){
  this.content = [];
  this.scoreFunction = scoreFunction;
}
//Score function takes object as value, and must return a number, the smaller the value, the faster it will be returned!

BW.Heap.prototype = {
  push: function(element) {
    // Add the new element to the end of the array.
    this.content.push(element);
    // Allow it to bubble up.
    this.bubbleUp(this.content.length - 1);
  },

  pop: function() {
    // Store the first element so we can return it later.
    var result = this.content[0];
    // Get the element at the end of the array.
    var end = this.content.pop();
    // If there are any elements left, put the end element at the
    // start, and let it sink down.
    if (this.content.length > 0) {
      this.content[0] = end;
      this.sinkDown(0);
    }
    return result;
  },

  remove: function(node) {
    var length = this.content.length;
    // To remove a value, we must search through the array to find
    // it.
    for (var i = 0; i < length; i++) {
      if (this.content[i] != node) continue;
      // When it is found, the process seen in 'pop' is repeated
      // to fill up the hole.
      var end = this.content.pop();
      // If the element we popped was the one we needed to remove,
      // we're done.
      if (i == length - 1) break;
      // Otherwise, we replace the removed element with the popped
      // one, and allow it to float up or sink down as appropriate.
      this.content[i] = end;
      this.bubbleUp(i);
      this.sinkDown(i);
      break;
    }
  },

  size: function() {
    return this.content.length;
  },

  bubbleUp: function(n) {
    // Fetch the element that has to be moved.
    var element = this.content[n], score = this.scoreFunction(element);
    // When at 0, an element can not go up any further.
    while (n > 0) {
      // Compute the parent element's index, and fetch it.
      var parentN = Math.floor((n + 1) / 2) - 1,
      parent = this.content[parentN];
      // If the parent has a lesser score, things are in order and we
      // are done.
      if (score >= this.scoreFunction(parent))
        break;

      // Otherwise, swap the parent with the current element and
      // continue.
      this.content[parentN] = element;
      this.content[n] = parent;
      n = parentN;
    }
  },

  sinkDown: function(n) {
    // Look up the target element and its score.
    var length = this.content.length,
    element = this.content[n],
    elemScore = this.scoreFunction(element);

    while(true) {
      // Compute the indices of the child elements.
      var child2N = (n + 1) * 2, child1N = child2N - 1;
      // This is used to store the new position of the element,
      // if any.
      var swap = null;
      // If the first child exists (is inside the array)...
      if (child1N < length) {
        // Look it up and compute its score.
        var child1 = this.content[child1N],
        child1Score = this.scoreFunction(child1);
        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore)
          swap = child1N;
      }
      // Do the same checks for the other child.
      if (child2N < length) {
        var child2 = this.content[child2N],
        child2Score = this.scoreFunction(child2);
        if (child2Score < (swap == null ? elemScore : child1Score))
          swap = child2N;
      }

      // No need to swap further, we are done.
      if (swap == null) break;

      // Otherwise, swap and continue.
      this.content[n] = this.content[swap];
      this.content[swap] = element;
      n = swap;
    }
  }
};
//<

//GRAVEYARD

////$ MY_QUADTREE
////design{
////tree of sqaures
////
//
////FACE FUNCTION
//
////(x1,x2,y1,y2,nLayerS,nPopDivideS,nLayerScaleS)
//BW.GenSquareTree=function(x,y,iLayerScaleS,iPopDivideS){
//  var ret=new BW._SquareTreeNode(0,0,x,y,null,null,0)
//  ret.x=x
//  ret.y=y
//  ret.iLayerScaleS=iLayerScaleS
//  ret.iPopDivideS=iPopDivideS
//  for(var i=0;i<iLayerScaleS.length;i++){
//    ret.x*=iLayerScaleS[i];
//    ret.y*=iLayerScaleS[i];
//  }
//  return ret
//}
//
////INNER FUNCTION
//
////(x1,x2,y1,y2,root,parent)
//BW._SquareTreeNode=function(x1,x2,y1,y2,root,parent,iLayer,iPopDivide){
//  this._x1=x1
//  this._y1=y1
//  this._w=x2-x1
//  this._h=y2-y1
//  this._x2=x2
//  this._x2=x2
//  this._root=root
//  this._parent=parent
//  this._agents=undefined
//  this._children={}
//  this._pop=0
//  this._iLayer=iLayer
//  this._iPopDivide=iPopDivide
//}
//
////(x,y)->In
//BW._SquareTreeNode.prototype.In=function(x,y){
//  return x<this._x1||x>this._x2||y<this._y1||y>this._y2?false:true
//}
//
////(x1,x2,x2,y2)->complete square is in
//BW._SquareTreeNode.prototype.Encloses=function(x1,y1,x2,y2){
//  return x1>this._x1||x2>this._x2||y1<this._y1||y2>this._y2?false:true
//}
//
//BW._SquareTreeNode.prototype.Touches=function(x1,x2,y1,y2){
//  return this._x2>x1&&this._x1<x2&&this._y2>y1&&this._y1<y2?true:false
//}
//
//BW._I=function(x,y){
//  x=~~x
//  y=~~y
//  if(this.x2)
//}
//
////adds agent to child
//BW._SquareTreeNode._AddChild=function(obj,x,y){
//  var i=BW._I(x,y)
//  var child=this.children[coords]
//  if(child){
//    child.Add(obj,x,y)
//  }
//  else{
//    this._children[coords]=new BW._SquareTreeNode()
//  }
//}
//
////adds agent
//BW._SquareTreeNode.prototype.Add=function(obj,x,y){
//  this._SetAgentProperties(obj,x,y,undefined,this.agents)
//  this._agents=obj
//  this._pop++
//  if(this._pop>this.iPopDivide){
//  //subdivide
//  for()
//  }
//}
//
//BW._SquareTreeNode.prototype.GetSquare=function(){
//}

//A BUILT IN AGENT

//W._SquareTreeNode.prototype.SetAgentProtoProperties=function(obj){
// if(obj.prototype._bSquareTreeAgent){throw "Already initialized prototype!"}
// obj.prototype._bSquareTreeAgent=true
// obj.prototype.X=function(){
//   return this._SquareTreeAgentX
// }
// obj.prototype.Y=function(){
//   return this._SquareTreeAgentY
// }
//
//
//W._SquareTreeNode.prototype._SetAgentProperties=function(obj,x,y,prev,next){
// if(!obj.prototype._bSquareTreeAgent){throw "Need to initialize prototype first"}
// obj._SquareTreeAgentX=x 
// obj._SquareTreeAgentY=y
// obj._SquareTreePrev=prev
// obj._SquareTreeNext=next
//




//BW._SquareTreeNode.prototype

//<

//$ QUADTREE
//	BW.QuadTree=function( bounds, max_objects, max_levels, level ) {
//		
//		this.max_objects	= max_objects || 10;
//		this.max_levels		= max_levels || 4;
//		
//		this.level 		= level || 0;
//		this.bounds 		= bounds;
//		
//		this.objects 		= [];
//		this.nodes 		= [];
//	};
//	
//	
//	/*
//	 * Split the node into 4 subnodes
//	 */
//	BW.QuadTree.prototype.split = function() {
//		
//		var 	nextLevel	= this.level + 1,
//			subWidth	= Math.round( this.bounds.width / 2 ),
//			subHeight 	= Math.round( this.bounds.height / 2 ),
//			x 		= Math.round( this.bounds.x ),
//			y 		= Math.round( this.bounds.y );		
//	 
//	 	//top right node
//		this.nodes[0] = new BW.QuadTree({
//			x	: x + subWidth, 
//			y	: y, 
//			width	: subWidth, 
//			height	: subHeight
//		}, this.max_objects, this.max_levels, nextLevel);
//		
//		//top left node
//		this.nodes[1] = new BW.QuadTree({
//			x	: x, 
//			y	: y, 
//			width	: subWidth, 
//			height	: subHeight
//		}, this.max_objects, this.max_levels, nextLevel);
//		
//		//bottom left node
//		this.nodes[2] = new BW.QuadTree({
//			x	: x, 
//			y	: y + subHeight, 
//			width	: subWidth, 
//			height	: subHeight
//		}, this.max_objects, this.max_levels, nextLevel);
//		
//		//bottom right node
//		this.nodes[3] = new BW.QuadTree({
//			x	: x + subWidth, 
//			y	: y + subHeight, 
//			width	: subWidth, 
//			height	: subHeight
//		}, this.max_objects, this.max_levels, nextLevel);
//	};
//	
//	
//	/*
//	 * Determine which node the object belongs to
//	 * @param Object pRect		bounds of the area to be checked, with x, y, width, height
//	 * @return Integer		index of the subnode (0-3), or -1 if pRect cannot completely fit within a subnode and is part of the parent node
//	 */
//	BW.QuadTree.prototype.getIndex = function( pRect ) {
//		
//		var 	index 			= -1,
//			verticalMidpoint 	= this.bounds.x + (this.bounds.width / 2),
//			horizontalMidpoint 	= this.bounds.y + (this.bounds.height / 2),
//	 
//			//pRect can completely fit within the top quadrants
//			topQuadrant = (pRect.y < horizontalMidpoint && pRect.y + pRect.height < horizontalMidpoint),
//			
//			//pRect can completely fit within the bottom quadrants
//			bottomQuadrant = (pRect.y > horizontalMidpoint);
//		 
//		//pRect can completely fit within the left quadrants
//		if( pRect.x < verticalMidpoint && pRect.x + pRect.width < verticalMidpoint ) {
//			if( topQuadrant ) {
//				index = 1;
//			} else if( bottomQuadrant ) {
//				index = 2;
//			}
//			
//		//pRect can completely fit within the right quadrants	
//		} else if( pRect.x > verticalMidpoint ) {
//			if( topQuadrant ) {
//				index = 0;
//			} else if( bottomQuadrant ) {
//				index = 3;
//			}
//		}
//	 
//		return index;
//	};
//	
//	
//	/*
//	 * Insert the object into the node. If the node
//	 * exceeds the capacity, it will split and add all
//	 * objects to their corresponding subnodes.
//	 * @param Object pRect		bounds of the object to be added, with x, y, width, height
//	 */
//	BW.QuadTree.prototype.insert = function( pRect ) {
//		
//		var 	i = 0,
//	 		index;
//	 	
//	 	//if we have subnodes ...
//		if( typeof this.nodes[0] !== 'undefined' ) {
//			index = this.getIndex( pRect );
//	 
//		  	if( index !== -1 ) {
//				this.nodes[index].insert( pRect );	 
//			 	return;
//			}
//		}
//	 
//	 	this.objects.push( pRect );
//		
//		if( this.objects.length > this.max_objects && this.level < this.max_levels ) {
//			
//			//split if we don't already have subnodes
//			if( typeof this.nodes[0] === 'undefined' ) {
//				this.split();
//			}
//			
//			//add all objects to there corresponding subnodes
//			while( i < this.objects.length ) {
//				
//				index = this.getIndex( this.objects[ i ] );
//				
//				if( index !== -1 ) {					
//					this.nodes[index].insert( this.objects.splice(i, 1)[0] );
//				} else {
//					i = i + 1;
//			 	}
//		 	}
//		}
//	 };
//	 
//	 
//	/*
//	 * Return all objects that could collide with the given object
//	 * @param Object pRect		bounds of the object to be checked, with x, y, width, height
//	 * @Return Array		array with all detected objects
//	 */
//	BW.QuadTree.prototype.retrieve = function( pRect ) {
//	 	
//		var 	index = this.getIndex( pRect ),
//			returnObjects = this.objects;
//			
//		//if we have subnodes ...
//		if( typeof this.nodes[0] !== 'undefined' ) {
//			
//			//if pRect fits into a subnode ..
//			if( index !== -1 ) {
//				returnObjects = returnObjects.concat( this.nodes[index].retrieve( pRect ) );
//				
//			//if pRect does not fit into a subnode, check it against all subnodes
//			} else {
//				for( var i=0; i < this.nodes.length; i=i+1 ) {
//					returnObjects = returnObjects.concat( this.nodes[i].retrieve( pRect ) );
//				}
//			}
//		}
//	 
//		return returnObjects;
//	};
//	
//	
//	/*
//	 * Clear the quadtree
//	 */
//	BW.QuadTree.prototype.clear = function() {
//		
//		this.objects = [];
//	 
//		for( var i=0; i < this.nodes.length; i=i+1 ) {
//			if( typeof this.nodes[i] !== 'undefined' ) {
//				this.nodes[i].clear();
//		  	}
//		}
//
//		this.nodes = [];
//	};
//
//
//<
