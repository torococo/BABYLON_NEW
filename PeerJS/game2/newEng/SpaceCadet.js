var prompt=require('prompt');
var myDir="/home/rafael/Dropbox/JS/PeerJS/game2/newEng/";
var fs=require('fs');

var writeFile=function(name,string){
  fs.writeFileSync(myDir+name,string);
};

var appendFile=function(name,string){
  fs.appendFileSync(myDir+name,string);
};

var readFile=function(name){
  var data=fs.readFileSync(myDir+name);
  return String(data);
};

var currentObjectives=["","",""];

var userInput=-1;

prompt.start();

var getInput=setInterval(function(){
  if(userInput>0){
    console.log("chosen command: "+userInput);
    if(userInput==1){
      console.log("change command 1");
      prompt.get(['comm'],function(err,res){
        currentObjectives[0]=res.comm;
      });
    }
    if(userInput==2){
      console.log("change command 2");
      prompt.get(['comm'],function(err,res){
        currentObjectives[1]=res.comm;
      });
    }
    if(userInput==3){
      console.log("change command 3");
      prompt.get(['comm'],function(err,res){
        currentObjectives[2]=res.comm;
      });
    }
    userInput=-1;
  }
  else if(userInput<0){
    userInput=0;
    prompt.get(['comm'],function(err,res){
      userInput=res.comm;
    });
  }
},1000);

var currRoom="bridge";
  prompt.start();
  prompt.get(['comm'],function(err,res){
    console.log(res.comm);
  });
//var runFunc=function(){
//  if(currRoom=="bridge"){
//    console.log("hi, here's the menu:\n(1) observation deck\n(2) command center\n(3) reviatalization locus");
//  }
//};

