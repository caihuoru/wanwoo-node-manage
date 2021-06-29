var net = require('net');
const proxyPort = (srcport,destServer,destport)=>{
  var server = net.createServer(function(c) { //'connection' listener
    c.on('end', function() {
        console.log('src disconnected');
    });
    var client = net.connect({port: destport,host:destServer},function() { //'connect' listener
         //console.log('ok....');
         c.on('data', function(data) {
            console.log(data.length);
            console.log(data.toString());
            client.write(data);
         });
    });

    client.on('error', function(err) {
     console.log("dest=" + err);
     c.destroy();
    });

    c.on('error', function(err) {
     console.log("src" + err);
     client.destroy();
    });

    client.on('data', function(data) {
     console.log(data.length);
     console.log(data.toString());
     c.write(data);
    });

    client.on('end', function() {
     console.log('dest disconnected ');
    });

  });
  server.listen(srcport, function() { //'listening' listener
   console.log('server bound' + srcport);
  });
}
module.exports = proxyPort