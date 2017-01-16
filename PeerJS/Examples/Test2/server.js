var peerjsPort = 2015;    // non-stanard port for TURN/STUN to work.

var PeerServer = require('peer').PeerServer;  
var peerserver = PeerServer({port: peerjsPort, path: '/peerjs'});

peerserver.on('connection', function(id) {  
  // console.log("[+] NEW PEER CONNECTION from peerjs: "+id);
  // accept or reject code can go here if needed
});
peerserver.on('disconnect', function(id) {  
  // console.log("[-] END OF PEER CONNECTION from peerjs: "+id);
  // accept or reject code can go here if needed
});

