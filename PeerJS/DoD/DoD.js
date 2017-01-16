/*
 *
 * Data Oriented Design:
 * memory is composed of lists of certain object litarals, with a set number of bytes
 * these lists must be given enough memory at outset... until sufficient technology is researched.
 *
 * created using javascript typed arrays
 *
 * typed arrays will be loaded into functions, along with other args
 * functions will wrap functions that take specific args and are more generral
 *
 *
 * List of acceptable types to make up a type in DoD:
 * Int8Array
 * Uint8Array
 * Uint8ClampedArray
 * Int16Array
 * Uint16Array
 * Int32Array
 * Uint32Array
 * Float32Array
 * Float64Array
 *
 */

var typeDef=function(types,sizes,names){
  console.log(types[0]);
  console.log(sizes[0]);
  console.log(names[0]);
  this._types=types;
  this._sizes=sizes;
  this._names=names;
  this._totSize=0;
  for(var i=0;i<this._sizes.length;i++){
    this._totSize+=this._types[i].BYTES_PER_ELEMENT*this._sizes[i];
  }
  console.log(this._totSize);
};

var typeList=function(myTypeDef,numEntries){
  this._typeDef=myTypeDef;
  this.length=numEntries;
  this._memory=numEntries*this._typeDef._totSize;
  this.numRunning=0;
  this.
//  this.get=function(typeIndex,name,index){
//    if(index===undefined){index=0;}
//    var entryLoc=this.typeDef.totSize;
//  };
//  this.set=function(typeIndex,name,val,index){
//    if(index===undefined){index=0;}
//  };
};

var testType=typeDef([Int8Array],[1],["test"]);
