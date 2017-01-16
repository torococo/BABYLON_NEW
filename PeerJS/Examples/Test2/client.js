// first client use these settings (Peer1)
// var client = 'from';
// var peerID = '1234';
// var partnerPeerID = '5678';

// second client use these settings (Peer2)
// var client = 'to';
// var peerID = '5678';
// var partnerPeerID = '1234';

peer = new Peer(peerID,{
  host:'/',
  port:2015,
  debug:3,
  path:'peerjs',
  'iceServers':
    [{url:'stun:stun.l.google.com:19302'}] 
});

if(client == 'from') {  
  var c = peer.connect(partnerPeerID);
  c.on('open',function() {
    console.log("P1 Open");
    c.on('data', function(data) {
      console.log("P1 got data");
      alert(data);
      c.send("I got your hello, back at ya");
      console.log("P1 sent reply");
    });
  });
} else {
  peer.on('connection', function(c) {
    console.log("P2 Connected");
    c.on('open',function() {
      console.log("P2 Open");
      c.send('Hello');
      console.log("P2 Sent hello");
      c.on('data', function(data) {
        console.log("P2 got data");
        alert(data);
      });
    });
  });
}

