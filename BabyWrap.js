"use strict";
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
BW.QuickFlyCamera=function(name,scene,canvas,vPos,vTarget){
  var ret=new BW.FreeCamera(name,vPos,scene)
  ret.keysUp.push(87)
  ret.keysDown.push(83)
  ret.keysLeft.push(65)
  ret.keysRight.push(68)
  ret.setTarget(vTarget)
  ret.attachControl(canvas,false)
  return ret
}

//causes the mouse to toggle between locked and unlocked
BW.ClickLockCamera=function(scene,canvas,ClickResponse){
  scene.isLocked=false;
	scene.onPointerDown = function (evt) {
		//true/false check if we're locked, faster than checking pointerlock on each single click.
		if(!this.isLocked) {
			canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
			if(canvas.requestPointerLock) {
				canvas.requestPointerLock();
			}
		}
    else if(ClickResponse){ ClickResponse(evt) }
  }

	var pointerlockchange=function(){
	var controlEnabled = document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || document.pointerLockElement || null;
		if(!controlEnabled) {
			this.isLocked = false
		} 
    else {
			this.isLocked = true
		}
	}

	document.addEventListener("pointerlockchange", pointerlockchange.bind(scene), false)
	document.addEventListener("mspointerlockchange", pointerlockchange.bind(scene), false)
	document.addEventListener("mozpointerlockchange", pointerlockchange.bind(scene), false)
	document.addEventListener("webkitpointerlockchange", pointerlockchange.bind(scene), false)
}

//impose maximum view distance on the camera, with fadeout to fog BW.QuickFog=function(scene,min,max){
BW.QuickFog=function(scene,camera,min,max){
  scene.fogMode=BW.Scene._FOGMODE_LINEAR
  scene.fogStart=min
  scene.fogEnd=max
  camera.maxZ=max
}
//<

//$ SCENE FUNCTIONS
//creates default scene, with no meshes
BW.BasicScene=function(canvas){
  var ret={}
  ret.engine=new BW.Engine(canvas,true)
  ret.scene = new BW.Scene(ret.engine);
  ret.camera = new BW.FreeCamera("camera1", new BW.Vector3(0, 5, -10), ret.scene);
  ret.camera.setTarget(BW.Vector3.Zero());
  ret.camera.attachControl(ret.canvas, true);
  ret.light = new BW.HemisphericLight("light1", new BW.Vector3(0, 1, 0), ret.scene);
  ret.light.intensity = 0.7;
  var sphere = BW.Mesh.CreateSphere("sphere1", 16, 2, ret.scene);
  sphere.position.y = 1;
  ret.ground = BW.Mesh.CreateGround("ground1", 6, 6, 2, ret.scene);
  ret.engine.runRenderLoop(function(){this.scene.render()}.bind(ret))
  return ret
}
BW.QuickSceneDefaults=function(canvas){
  var ret={}
  ret.engine=new BW.Engine(canvas,true)
  ret.scene=new BW.Scene(ret.engine)
  ret.scene.clearColor=new BW.C3(0,0,0)
  ret.scene.ambientColor=new BW.C3(1,1,1)
  ret.camera=BW.QuickFlyCamera('camera1',ret.scene,ret.canvas,new BW.V3(0,5,0),new BW.V3(0,0,0))
  ret.light=new BW.HemisphericLight('light1',new BW.V3(0,1,0),ret.scene)
  ret.Start=function(){ret.engine.runRenderLoop(function(){ret.scene.render()}.bind(ret))}
  window.addEventListener('resize',ret.engine.resize.bind(ret.engine))
  ret.physPlugin=new BW.OimoJSPlugin()
  ret.scene.enablePhysics(new BW.V3(0,-10,0),ret.physPlugin)
  //ret.SetResize=function(){window.addEventListener('resize',function(){ ret.engine.resize()})}
  return ret
}

//(canvas,cSky,cAmbient)
BW.QuickScene=function(canvas,cSky,cAmbient){
  var ret={}
  ret.engine=new BW.Engine(canvas,true,null,false)
  ret.scene=new BW.Scene(ret.engine)
  if(cSky){ ret.scene.clearColor=cSky }
  if(cAmbient){ret.scene.ambientColor=cAmbient}
  ret.Start=function(){ret.engine.runRenderLoop(function(){ret.scene.render()}.bind(ret))}
  window.addEventListener('resize',ret.engine.resize.bind(ret.engine))
  ret.physPlugin=new BW.OimoJSPlugin()
  ret.scene.enablePhysics(new BW.V3(0,-10,0),ret.physPlugin)
  //ret.SetResize=function(){window.addEventListener('resize',function(){ ret.engine.resize()})}
  return ret
}
//<

//$ LIGHT FUNCTIONS
//(name,scene,vDiffuse,vSpecular,vPosition)
BW.QuickLightPoint=function(name,scene,vPosition,cDiffuse,cSpecular){
  var ret=new BW.PointLight(name,vPosition,scene)
  if(cDiffuse){ret.diffuse=cDiffuse}
  if(cSpecular){ret.specular=cSpecular}
  return ret
}

//(name,scene,vPosition,cDiffuse,cSpecular,cGroundColor)
BW.QuickLightHemispheric=function(name,scene,vPosition,cDiffuse,cSpecular,cGroundColor){
  var ret=new BW.HemisphericLight(name,vPosition,scene)
  if(cDiffuse){ret.diffuse=cDiffuse}
  if(cSpecular){ret.specular=cSpecular}
  if(cGroundColor){ret.groundColor=cGroundColor}
  return ret
}

//(name,scene,vPosition,vDirection,nAngle,nExponent,cDiffuse,cSpecular)
BW.QuickLightSpot=function(name,scene,vPosition,vDirection,nAngle,nExponent,cDiffuse,cSpecular){
  var ret=BW.SpotLight(name,vPosition,vDirection,nAngle,nExponent)
  if(cDiffuse){ret.diffuse=cDiffuse}
  if(cSpecular){ret.specular=cSpecular}
  return ret
}

//(name,scene,vDirection,cDiffuse,cSpecular)
BW.QuickLightDirectional=function(name,scene,vDirection,cDiffuse,cSpecular){
  var ret=new BW.DirectionalLight(name,vDirection,scene)
  if(cDiffuse){ret.diffuse=cDiffuse}
  if(cSpecular){ret.specular=cSpecular}
  return ret
}
//<

//$ MESH FUNCTIONS
//creates a material with all the coloring information filled in
BW.QuickColorMat=function(name,scene,cDiffuse,cSpecular,cAmbient,cEmissive,nSpecPower,nAlpha){
  var ret=new BW.StandardMaterial(name,scene)
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

//(name,scene,nSubdivisions,nRadius,material,vPosition,imposterArgs)
BW.QuickBall=function(name,scene,vPosition,nRadius,nTessellation,material,imposterArgs){
  var ret=BW.Mesh.CreateSphere(name,nTessellation,nRadius,scene)
  if(material){ret.material=material}
  if(vPosition){ret.position=vPosition}
  if(imposterArgs){ret.setPhysicsState(BW.PhysicsImpostor.SphereImpostor,imposterArgs,scene)}
  return ret
}

//(name,scene,vPosition,vRotation,nRadius,nHeight,nTessellation,material,imposterArgs)
BW.QuickCylinder=function(name,scene,vPosition,vRotation,nRadius,nHeight,nTessellation,material,imposterArgs){
  var diam=nRadius*2
  var ret=BW.Mesh.CreateCylinder(name,nHeight,diam,diam,nTessellation,scene)
  if(vPosition){ret.position=vPosition}
  if(vRotation){ret.rotation=vRotation}
  if(material){ret.material=material}
  if(imposterArgs){ret.setPhysicsState(BW.PhysicsImpostor.CylinderImpostor,imposterArgs,scene)}
  return ret
}

//(name,scene,vPosition,vRotation,vScaling,material,imposterArgs)
BW.QuickBox=function(name,scene,vPosition,vRotation,vScaling,material,imposterArgs){
  var ret=BW.Mesh.CreateBox(name,1,scene,false)
  if(vPosition){ret.position=vPosition}
  if(vRotation){ret.rotation=vRotation}
  if(vScaling){ret.scaling=vScaling}
  if(material){ret.material=material}
  if(imposterArgs){ret.setPhysicsState(BW.PhysicsImpostor.BoxImpostor,imposterArgs,scene)}
}

//(name,scene,vPosition,vRotation,vScaling,material,imposterArgs,bDoubleSided)
BW.QuickPlane=function(name,scene,vPosition,vRotation,vScaling,material,imposterArgs,bDoubleSided){
  var sided=bDoubleSided?BW.Mesh.DOUBLESIDE:BW.Mesh.DEFAULTSIDE
  var ret=BW.Mesh.CreatePlane(name,1,scene,false,sided)
  if(vPosition){ret.position=vPosition}
  if(vRotation){ret.rotation=vRotation}
  if(vScaling){ret.scaling=vScaling}
  if(material){ret.material=material}
  if(imposterArgs){ret.setPhysicsState(BW.PhysicsImpostor.PlaneImpostor,imposterArgs,scene)}
  return ret
}

//BW.QuickPlane=function(name,nCorner1,nCorner2,nPointOnPlane,)

//<

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
