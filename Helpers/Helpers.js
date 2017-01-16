"use strict"
var mergeSortedArr=function(Arr1,Arr2,comp){
  var Arr1L=Arr1.length;
  var Arr2L=Arr2.length;
  var result=[];//new Array(Arr1+Arr2);
  var i2=0;
  var i1=0;
  while(i2<Arr2L&&i1<Arr1L){
    if(comp(Arr1[i1],Arr2[i2])<0){
      result.push(Arr1[i1]);
      i1+=1;
    } else{
      result.push(Arr2[i2]);
      i2+=1;
    }
  }
  return result.concat(Arr2.slice(i2)).concat(Arr1.slice(i1));
};

var accInterval=function(func,duration,start,stallFunc){
  this.func=func;
  this.stallFunc=stallFunc;
  this.duration=duration;
  this.start=start;
  this.recLoop=function(){
    this.func();
    this.start+=this.duration;
    var waitTime=this.start-Date.now();//get relative time from a third party!
    if(waitTime<0){waitTime=0;this.stallFunc();}
    this.timeout=setTimeout(this.recLoop,waitTime);
  }.bind(this);
  this.timeout=setTimeout(this.recLoop,start-Date.now());
  this.killLoop=function(){
    clearTimeout(this.timeout);
  };
};

var flexInterval=function(func,duration,start){
  this.func=func;
  this.duration=duration;
  console.log(this.duration);
  this.start=start;
  this.recLoop=function(){
    var startTime=Date.now();
    this.func();
    var waitTime=Math.max(0,duration-(Date.now()-startTime));
    this.timeout=setTimeout(this.recLoop,waitTime);
  }.bind(this);
  this.timeout=setTimeout(this.recLoop,start-Date.now());
  this.setDuration=function(newDur){
    this.duration=newDur;
  };
  this.goNow=function(){
    clearTimeout(this.timeout);
    this.recLoop();
  };
  this.killLoop=function(){
    clearTimeout(this.recLoop);
  };
};


//accInterval(function(){console.log("Hello world");},1000,5000+Date.now(),function(){console.log("Stalling");});

var tagFuncs=function(){
  this.tagFuncList={};
};

tagFuncs.prototype={
  addFunc:function(tag,tagFunc){
    this.tagFuncList[tag]=tagFunc;
  },
  run:function(dataObj){
    dataObj=JSON.parse(dataObj);
    var dataTag=dataObj.tag;
    var chosenFunc;
    if(dataTag){
      chosenFunc=this.tagFuncList[dataTag];
    } else{
      console.log("error, data packet has no tag!");
      console.log(dataObj);
      return;
    }
    if(chosenFunc){
      chosenFunc(dataObj);
    } else{
      console.log("error, function for tag does not exist!");
      console.log(dataObj);
    }
  }
  };

  if(typeof module!== 'undefined'){
    module.exports.mergeSortedArr=mergeSortedArr;
    module.exports.accInterval=accInterval;
    module.exports.flexInterval=flexInterval;
    module.exports.tagFuncs=tagFuncs;
  }
