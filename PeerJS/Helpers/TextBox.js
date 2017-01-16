var TextBox=function(context,x,y,width,height,text){
  if(text){ this.text=text; }
  else{ this.text=""; }
  this.ctx=context;
  this.x=x;
  this.y=y;
  this.width=width;
  this.height=height;
  this.currLine=0;
  this.lines=[];
  this.foreground='#000000';
  this.background='#FFFFFF';
  this.fontSize=8;
  this.lineSpace=1.5;
  this.setFontSize(this.fontSize);
  this.buffer=2;
  this.drawBox=true;
  this.visible=true;
  this.autoScroll=true;
  this.write(this.text);
};
TextBox.prototype={
  render:function(){
    if(this.visible){
      if(this.drawBox){
        this.ctx.fillStyle=this.background;
        this.ctx.fillRect(this.x-this.buffer,this.y-this.buffer,this.width+this.buffer*2,this.height+this.buffer*2);
        this.ctx.fillStyle=this.foreground;
        this.ctx.strokeRect(this.x-this.buffer,this.y-this.buffer,this.width+this.buffer*2,this.height+this.buffer*2);
      }
      this.ctx.font=this.fontSize+"px Courier";
      this.ctx.fillStyle=this.foreground;
      var numLines=0;
      var TotalLines=~~(this.height/this.letterh);
      if(this.autoScroll&&TotalLines<this.lines.length){
        this.currLine=this.lines.length-TotalLines;
      }
      var lineNum=this.currLine;
      while((numLines+1)*this.letterh<=this.height&&lineNum<this.lines.length){
        this.ctx.fillStyle=this.foreground;
        this.ctx.fillText(this.lines[lineNum],this.x,this.y+this.letterh*(numLines+1));
        numLines+=1;
        lineNum+=1;
      }
    }
  },
 addButtonFunc:function(buttonFunc){
    var that=this;
    this.buttonFunc=function(event){
      var canv=that.ctx.canvas;
      //var rect=that.ctx.canvas.getBoundingClientRect();
      var x=event.x-10;
      var y=event.y-10;
      if(x>=that.x-that.buffer&&x<=that.x+that.width+that.buffer&&y>=that.y-that.buffer&&y<=that.y+that.height+that.buffer){
        buttonFunc();
      }
    };
    window.addEventListener("click",this.buttonFunc,false);
  },
  remButtonFunc:function(){
    window.removeEventListener("click",this.buttonFunc,false);
  },
  makeTextArr:function(text){
    var ret=[];
    var paragraphs = text.split('\n');
    for (var i = 0; i < paragraphs.length; i++) {
      if(paragraphs[i].length===0){
        ret.push("");
      }
      else{
        var words = paragraphs[i].split(' ');
        var currLineLength=0;
        var numWords=0;
        for (var n = 0; n < words.length; n++) {
          currLineLength+=words[n].length*this.letterw;
          if(numWords>0){ currLineLength+=this.letterw; }//add extra letter width for space between words
          if(currLineLength>this.width){
            if(numWords>0){
              var line=words.slice(n-numWords,n).join(" ");
              ret.push(line);
            }
            else if(numWords===0){
              var thisLineLetters=~~(this.width/this.letterw);
              ret.push(words[n].substring(0,thisLineLetters));
              words[n]=words[n].substring(thisLineLetters);
            }
            currLineLength=0;
            numWords=0;
            n-=1;//redo word that is too long
          }
          else{ numWords+=1; }//if the line is not long enough, add another word
        }
        if(currLineLength){
          ret.push(words.slice(n-numWords,n).join(" "));//if after the for loop, there is still some text, write it as a new line
        }
      }
    }
    return ret;
  },
  write:function(text){
    this.text=text;
    this.lines=this.makeTextArr(this.text);
    this.render();
  },
  append:function(text){
    if(this.text){
      this.text+='\n'+text;
      this.lines=this.lines.concat(this.makeTextArr(text));
    }
    else{
      this.write(text);
      //kinda like write but adds to end as newline
    }
    this.render();
  },
  extend:function(text){
    if(this.text){
      this.text+=text;
      var lastIndex=this.lines.length-1;
      this.lines[lastIndex]+=text;
      var newLines=this.makeTextArr(this.lines[lastIndex]);
      this.lines.pop();
      this.lines=this.lines.concat(newLines);
    }
    else{
      this.write(text);
    }
    this.render();
  },
  setFontSize:function(size){
    this.fontSize=size;
    this.letterw=this.ctx.measureText(' ').width;
    this.letterh=~~(this.letterw*this.lineSpace);
    this.write(this.text);
  },
  scaleForChars:function(numPerRow,numCols){
    this.width=this.letterw*numPerRow;
    this.height=this.letterh*numCols;
  }
};
