// functions: render, scrollToLine, clickscroll
var scrollBar=function(context,NumLines,BarSize,x,y,w,h,horizontal){
  this.NumLines=NumLines;
  this.BarSize=BarSize;
  this.currLine=0;
  this.x=x;
  this.y=y;
  this.horizontal=horizontal;
  this.w=w;
  this.h=h;
  this.fgColor='#8B0000';
  this.bkColor='#A9A9A9';
  this.context=context;
  this.mouseEvtFuncs=this.addMouseFunc();
  window.add(function(){
  }
};
scrollBar.prototype={
  getBarCorner:function(){
    if(this.horizontal){
      return{x:this.x+this.currLine*this.w/this.NumLines,y:this.y};
    }
    return{x:this.x,y:this.y+this.currLine*this.h/this.NumLines)};
  },
  getBarDims:function(){
    if(this.horizontal){
      return{x:this.BarSize*this.w/this.NumLines,y:this.h};
    }
    return{x:this.w,y:this.BarSize*this.h/this.NumLines};
  },
  render:function(){
    this.context.fillStyle=this.bkColor;
    this.fillRect(this.x,this.y,this.w,this.h);
    this.context.fillStyle=this.fgColor;
    var BarCorner=this.getBarCorner();
    var BarDims=this.getBarDims();
    this.fillRect(BarCorner.x,BarCorner.y,BarDims.x,BarDims.y);
  },
  scrollToLine:function(num){
    if(num>==0&&num<this.NumLines-this.BarSize){
    this.currLine=num;
    this.render();
    }
  },
    addMouseFunc:function(){
      var ret=[];
      ret.push(function(event){
        var canv=this.ctx.canvas;
        var x=event.x-10;
        var y=event.y-10;
        var BarCorner=this.getBarCorner();
        var BarDims=this.getBarDims();
        if(x>BarCorner.x&&y>BarCorner.y&&x<BarCorner.x+BarDims.x&&y<BarCorner.y+BarDims.y){
        }
      }
    },
};
