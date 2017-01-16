var elem=function(value,list){
  this.val=value;
  this.list=list;
  this.next=this;
  this.prev=this;
};
elem.prototype={
  add:function(value){
    var addMe=new elem(value,this.list);
    addMe.prev=this;
    addMe.next=this.next;
    this.next.prev=addMe;
    this.next=addMe;
    return addMe;
  },
  rem:function(){
    this.list.length-=1;
    if(this.list.length<0){
      throw "error, removing from empty list";
    }
    if(this.list.length){
      if(this.list.first===this){
        this.list.first=this.next;
      }
      this.prev.next=this.next;
      this.next.prev=this.prev;
      return this.val;
    }
    delete this.list.first;
    return this.val;
  },
  apply:function(fn,args){
    var numDone=0;
    var listLen=this.list.length;
    var curr=this.list.first;
    do{
      var doMe=curr;
      curr=curr.next;
      fn.apply(doMe.val,args);
      numDone+=1;
    }while(numDone<listLen);
  },
  applyElem:function(fn,args){
    var numDone=0;
    var listLen=this.list.length;
    var curr=this.list.first;
    do{
      var doMe=curr;
      curr=curr.next;
      fn.apply(doMe,args);
      numDone+=1;
    }while(numDone<listLen);
  },
  sublist:function(fn,args){
    var ret=new LL();
    var curr=this;
    do{
      if(fn.apply(curr.val,args)){
        ret.push(curr.val);
      }
      curr=curr.next;
    }while(curr!=this);
    return ret;
  },
  subArray:function(fn,args){
    var ret=[];
    var curr=this;
    do{
      if(fn.apply(curr.val,args)){
        ret.push(curr.val);
      }
      curr=curr.next;
    }while(curr!=this);
    return ret;
  },
  find:function(fn,args){
    var curr=this;
    do{
      if(fn.apply(curr.val,args)){
        return curr;
      }
      curr=curr.next;
    }while(curr!=this);
  },
  toArray:function(){
    var ret=[];
    var curr=this;
    do{
      ret.push(curr.val);
      curr=curr.next;
    }while(curr!=this);
    return ret;
  },
};
var LL=function(){
  this.length=0;
  this.first=null;
};
LL.prototype={
  empty:function(){
    this.length=0;
    this.first=null;
  },
  push:function(value){
    if(this.length){
      this.first=this.first.prev.add(value,this);
    }
    else{
      this.first=new elem(value,this);
    }
    this.length+=1;
    return this.first;
  },
  pop:function(){
    if(this.occupied()){
      return this.first.rem();
    }
  },
  pushEnd:function(value){
    if(this.length){
      this.first.prev.add(value,this);
    }
    else{
      this.first=new elem(value,this);
    }
    this.length+=1;
    return this.first;
  },
  popEnd:function(){
    if(this.occupied()){
      return this.first.prev.rem();
    }
  },
  peek:function(){
    if(this.occupied()){
      return this.first.val;
    }
  },
  occupied:function(){
    if(this.length){
      return true;
    }
    return false;
  },
  apply:function(fn,args){
    if(this.occupied()){
      return this.first.apply(fn,args);
    }
  },
  applyRev:function(fn,args){
    if(this.occupied()){
      return this.first.applyRev(fn,args);
    }
  },
  //applyElem:function(fn,args){
  //}
  sublist:function(fn,args){
    if(this.occupied()){
      return this.first.sublist(fn,args);
    }
  },
  //  subArray:function(fn,args){
  //    if(this.occupied()){
  //      return this.first.subArray(fn,args);
  //    }
  //  },
  find:function(fn,args){
    if(this.occupied()){
      return this.first.find(fn,args);
    }
  },
  toArray:function(){
    if(this.occupied()){
      return this.first.toArray();
    }
  },
  getMax:function(fn,args){
    var numDone=0;
    var listLen=this.length;
    var curr=this.first;
    var maxObj;
    var maxVal=-Number.MAX_VALUE;
    do{
      var doMe=curr;
      curr=curr.next;
      var compRes=fn.apply(doMe.val,args);
      if(compRes>maxVal){
        maxVal=compRes;
        maxObj=doMe.val;
      }
      numDone+=1;
    }while(numDone<listLen);
    return {obj:maxObj,val:maxVal};
  },
};
var Item=function(value,prev,next){
  if(value){ this.val=value; }
  this.next = next ? next : this;
  this.prev = prev ? prev : this;
};
Item.prototype={
  push:function(value){//pushes to the end of the list
    if(this.val){
      var addMe=new Item(value,this.prev,this);
      this.prev.next=addMe;
      this.prev=addMe;
      return addMe;
    }
    else{ 
      this.val=value;
      return this;
    }
  },
  pop:function(){//pops the last elem
    var ret;
    if(!this.val){
      throw "removing from empty queue";
    }
    else if(this.next===this){
      ret=this.val;
      delete this.val;
      return ret;
    }
    else{
      ret=this.prev.val;
      this.prev.prev.next=this;
      this.prev=this.prev.prev;
      return ret;
    }
  },
  apply:function(fn,args){
    var first=this;
    var curr=this;
    do{
      var doMe=curr;
      curr=curr.next;
      fn.apply(doMe.val,args);
    }while(curr!=first);
  },
  applyElem:function(fn,args){
    var first=this;
    var curr=this;
    do{
      var doMe=curr;
      curr=curr.next;
      fn.apply(doMe,args);
    }while(curr!=first);
  },
  sublist:function(fn,args){
    var ret=new Item();
    var first=this;
    var curr=this;
    do{
      var doMe=curr;
      curr=curr.next;
      if(fn.apply(doMe.val,args)){
        ret.push(doMe.val);
      }
    }while(curr!=first);
    return ret;
  },
  find:function(fn,args){
    var curr=this;
    var first=this;
    do{
      var doMe=curr;
      curr=curr.next;
      if(fn.apply(doMe.val,args)){
        return doMe.val;
      }
    }while(curr!=first);
  },
  toArray:function(){
    var ret=[];
    var curr=this;
    do{
      ret.push(curr.val);
      curr=curr.next;
    }while(curr!=this);
    return ret;
  },
  substitute:function(){
    var ret;
    if(this.next===this){
      ret=new Item(this.val);
      delete this.val;
      return ret;
    }
    ret=new Item(this.val,this.prev,this.next);
    ret.prev.next=ret;
    ret.next.prev=ret;
    delete this.val;
    this.next=this;
    this.prev=this;
    return ret;
  },
  cut:function(cutMe){//cuts, from this element to the end of the list
    var cutItem;
    if(!cutMe){
      throw "nothing to cut out!";
    }
    if(cutMe!==this){
      cutItem=cutMe.substitute();
      cutItem.prev.next=this;
      var temp=cutItem.prev;
      cutItem.prev=this.prev;
      this.prev.next=cutItem;
      this.prev=temp;
    }
    else{
      cutItem=this.substitute();
    }
    return cutItem;
  },
  paste:function(pasteMe){//pastes this list to the end of the given list
    if(!pasteMe){
      throw "nothing to paste!";
    }
    if(!this.val){//basically replaces this with first.
      this.val=pasteMe.val;
      this.next=pasteMe.next;
      this.prev=pasteMe.prev;
      this.next.prev=this;
      this.prev.next=this;
      delete pasteMe.next;
      delete pasteMe.prev;
      delete pasteMe.val;
      return this;
    }
    var pasteItem=pasteMe.substitute();
    pasteItem.prev.next=this;
    var temp=this.prev;
    this.prev=pasteItem.prev;
    pasteItem.prev=temp;
    pasteItem.prev.next=pasteItem;
    return pasteItem;
  },
};
if(typeof module!== 'undefined'){
  module.exports.LL=LL;
  module.exports.Item=Item;
}
