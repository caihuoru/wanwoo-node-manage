const SSHClient = require('ssh2').Client;
const utf8 = require('utf8');
module.exports ={
    createNewServer:(machineConfig, socket)=>{
        let ssh = new SSHClient();
        let {msgId, ip, username, password} = machineConfig;
        ssh.on('ready', function () {
            socket.emit(msgId, '\r\n***' + ip + ' SSH CONNECTION ESTABLISHED ***\r\n');
            ssh.shell(function(err, stream) {
                if(err) {
                    return socket.emit(msgId, '\r\n*** SSH SHELL ERROR: ' + err.message + ' ***\r\n');
                }
                socket.on(msgId, function (data) {
                    stream.write(data);
                });
                stream.on('data', function (d) {
                    socket.emit(msgId, utf8.decode(d.toString('binary')));
                }).on('close', function () {
                    ssh.end();
                });
            })
        }).on('close', function () {
            socket.emit(msgId, '\r\n*** SSH CONNECTION CLOSED ***\r\n');
        }).on('error', function (err) {
            console.log(err);
            socket.emit(msgId, '\r\n*** SSH CONNECTION ERROR: ' + err.message + ' ***\r\n');
        }).connect({
            host: ip,
            port: 22,
            username: username,
            password: password
        });
    }
}