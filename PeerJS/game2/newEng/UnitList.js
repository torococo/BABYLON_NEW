var Unit=function(myUnitList){
  this.myUnitList=myUnitList;
  this.myDLs=myUnitList.DL;
};

var UnitList=function(maxUnits){
  this.maxUnits=maxUnits;
  this.DLs={};
  this.addDL=function(DLInfo,DLName){
  };
};

UnitList.prototype={
};

var DLInfo=function(names,types){
  this.names=names;
  this.types=types;
  this.makeGetSet(Unit.prototype);
};

DLInfo.prototype={
  GetSetHelper:function(otherObj,name,type){
    otherObj[g+name]=function(id){
      if(id){
      }
    };
  },
  makeGetSet:function(otherObj){
    for(var i in names){
    }
  },
};
