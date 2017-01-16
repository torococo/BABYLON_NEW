//var IntervalFunc=function(func,duration,start){
//  var loopFunc=function(func,duration,start){
//    func;
//    start+=duration;
//    setTimout(loopFunc(func,duration,start),1000);
//    return func;
//  }
//  this.Timeout=setTimout(loopFunc(func,duration,start),1000);
//  this.stop=function(){
//    this.clearTimeout(this.Timeout);
//  }
//}
//
//IntervalFunc(console.log("Hi"),100,Date.now()+100);


var accInerval=function(func,duration,start){
  this.func=func;
  this.duration=duration;
  this.start=start;
  this.recLoop=function(){
    this.func();
    this.start+=this.duration;
    this.timeout=setTimeout(this.recLoop,1000);
  }.bind(this);
  this.timeout=setTimeout(this.recLoop,1000);
}

accInerval(function(){console.log("Hi");},5,10);


//var timeLoop=function(func,duration,start){
//  this.stopTimeLoop=function(){
//    clearTimeout(this.TimeLoop);
//    console.log("called successfully!");
//  };
//  this.TimeLoop=function(func,duration,start){
//    setTimeout(function(){
//    func();
//    start+=duration;
//    setTimeout(this.TimeLoop(func,duration,start));
//    }
//  }.bind(this),start-Date.now());
//}
//
//var test=timeLoop(function(){console.log("wtf?")},1000,Date.now());
