var log = require('lib/log')(module),
    parser = require('parser');

var mongoose = require('lib/mongoose'),
    User = require('models/user').User,
    SeriesLostFilm = require('models/content/series').SeriesLostFilm;

var net = require('net'),
    JsonSocket = require('json-socket');

var accessControl = require('accessControl');



var passwordKey = 'd6F3Efeq';



log.info("Started");

var clients = [];

// Start a TCP Server
net.createServer(function (socket) {

    //var jsonSocket = new JsonSocket(socket);

    socket.name = socket.remoteAddress + ":" + socket.remotePort;

    clients.push(socket);


    //socket.write("Welcome " + socket.name + "\n");
    //broadcast(socket.name + " joined the chat\n", socket);

    setInterval(function () {
        parser.getUpdates('lostfilm', 2, function (err, res) {
            if (err) throw err;
            console.log('send updates');
            socket.write(JSON.stringify(res));

            //socket.write(crypto.encryptBuf(JSON.stringify(res), password));

            // можно и без него
            //jsonSocket.sendEndMessage(res);

        });
    }, 10000);
    


    socket.on('error', function () {
        console.log(arguments);
    });


    socket.on('data', function (data) {
        var authData = accessControl.getAuthJson(data, passwordKey);

        if (authData){
            User.findOne({nick: authData.login}, function (err, user) {
                if (err) throw err;
                if (user && user.checkPassword(authData.password)) {
                    console.log('connected user ' + user.nick);
                    clients.push({login: user.nick, socket: socket});
                } else {
                    console.log('fail to connect user ' + data.auth.login)
                }
            })
        }
    });

    socket.on('end', function () {
        clients.splice(clients.indexOf(socket), 1);
        broadcast(socket.name + " left the chat.\n");
    });


    function broadcast(message, sender) {
        clients.forEach(function (client) {
            if (client === sender) return;
            client.write(message);
        });
        process.stdout.write(message)
    }   

}).listen(5000, '192.168.0.100');

function createUpdateList() {
    
}

console.log("Tracker server running at port 5000\n");