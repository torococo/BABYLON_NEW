var ip=require('ip');
var PeerServer=require('peer').PeerServer;
var port=8001;
var server=new PeerServer({port:port,allow_discovery:true});//allow discovery means that the peerServer can be queryed about who the current clients are!
server.on('connection',function(id){
  console.log('new connection with id '+id);
});

server.on('disconnect',function(id){
  console.log('disconnect with id '+id);
});

console.log('peer server running on '+ip.address()+':'+port);
