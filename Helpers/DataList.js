var DataList=function(listName,numEntries,types,names){
  //types should be 0 for int, 1 for float
  if(types.length!=names.length){
    throw "DataList types and names must be the same length!";
  }
  this.listName=listName;
  this.names=names;
  this.types=types;
  this.entrySize=types.length;
  this.numEntries=numEntries;
  this.buffer=new ArrayBuffer(this.numEntries*this.entrySize*4);
  this.dataViewInt=new Int32Array(this.buffer);
  this.dataViewFloat=new Float32Array(this.buffer);
  this.makeGetSetAll();
  this.occupied=new ArrayBuffer(this.numEntries);
  this.length=0;
};

DataList.prototype={
  makeGetSet:function(name,type,index){
    if(type){
      this["g"+this.names[index]]=function(entryI){
        return this.dataViewFloat[entryI*this.entrySize+index];
      };
      this["s"+this.names[index]]=function(entryI,val){
        this.dataViewFloat[entryI*this.entrySize+index]=val;
      };
    }
    else{
      this["g"+this.names[index]]=function(entryI){
        return this.dataViewInt[entryI*this.entrySize+index];
      };
      this["s"+this.names[index]]=function(entryI,val){
        this.dataViewInt[entryI*this.entrySize+index]=val;
      };
    }
  },
  makeGetSetPrototype:function(name,type,index,myPtr,otherObj){
    if(type){
      otherObj["g"+myPtr.names[index]]=function(){
        return myPtr.dataViewFloat[this[myPtr.listName+"i"]*myPtr.entrySize+index];
      };
      otherObj["s"+myPtr.names[index]]=function(val){
        myPtr.dataViewFloat[this[myPtr.listName+"i"]*myPtr.entrySize+index]=val;
      };
    }
    else{
      otherObj["g"+myPtr.names[index]]=function(){
        return myPtr.dataViewInt[this[myPtr.listName+"i"]*myPtr.entrySize+index];
      };
      otherObj["s"+myPtr.names[index]]=function(val){
        myPtr.dataViewInt[this[myPtr.listName+"i"]*myPtr.entrySize+index]=val;
      };
    }
  },
  makeGetSetAll:function(){
    for(var i=0;i<this.types.length;i++){
      this.makeGetSet(this.names[i],this.types[i],i);
    }
  },
  addObj:function(Obj){
    if(this.empty.length){
      this.setObjIndex(Obj,this.empty.pop());
    }
    else{
      if(this.length<this.numEntries){
      this.length+=1;
      }
      else{
        console.log("error, DataList "+this.listName+" Overflow!");
      }
    }
  },
  remObj:function(Obj){
    ObjId=Obj[this.listName+"i"];
    if(this.length==ObjId){
      this.length-=1;
    }
    Obj[this.listName]=undefined;
  },
  setObjIndex:function(Obj,index){
    Obj[this.listName+"i"]=index;
  },
  setupObjPrototype:function(prototypeObj){
    for(var i=0;i<this.types.length;i++){
      this.makeGetSetPrototype(this.names[i],this.types[i],i,this,prototypeObj);
    }
  }
};

//var TestDL=new DataList("test",10,[1,0,1],['a','b','c']);
//
//var TestType=function(myDL){
//  this.name="testObj";
//  myDL.addObjIndex(this,0);
//};

//TestDL.setupObjPrototype(newTestType);

//TestDL.setupObjPrototype(TestType.prototype);
//var TestTypeSample=new TestType(TestDL);
////TestDL.sb(0,5);
//console.log(TestDL);
//TestTypeSample.sa(5);
//console.log(TestDL.dataViewInt);
//console.log(TestTypeSample.ga());

if(typeof module!=='undefined'){
  module.exports.DataList=DataList;
}
