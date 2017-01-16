/*
 *JSTIMER TIMES FUNCTIONS AND SUCH!!!!
 */

var Timer=function(recordingText){
  this.recordingText=recordingText;
  this.time=Date.now();
};
Timer.prototype={
  end:function(){
    this.time=Date.now()-this.time;
    this.print();
  },
  print:function(){
    console.log(this.recordingText+" \n\t["+this.time+"]\n");
  }
};

var DLInfo=require("/home/rafael/Dropbox/JS/Helpers/DataList.js");
//var myDL=new DLInfo.DataList("Coords",4,[0,0,0],[x,y,z]);

var testObj=function(){
  this.x=0;
  this.y=0;
  this.z=0;
};

var testObj2=function(){
};


var myDL=new DLInfo.DataList("Coords",10000000,[0,0,0],['x','y','z']);
var DLTimer=new Timer("DLTimer");
for(var i=0;i<1000000;i++){
  myDL.sx(i,5);
  myDL.sy(i,5);
  myDL.sz(i,5);
//  console.log(myDL.gx(i,5));
}

DLTimer.end();


var myNormL=[];
for (var i=0;i<1000000;i++){
  myNormL.push(new testObj());
}
var NormalTimer=new Timer("NormalTimer");
for (var i=0;i<1000000;i++){
  myNormL[i].x=5;
  myNormL[i].y=5;
  myNormL[i].z=5;
}

NormalTimer.end();
