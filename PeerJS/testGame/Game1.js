console.log(location.hostname);
var LS=new LSPeer("192.168.1.2",8001,function(){
  //RunFunc
  console.log("hello world!");
},
function(){
  //stallFunc
  console.log("stalling!");
});
