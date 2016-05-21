var log = require('lib/log')(module),
    parser = require('parser');

var mongoose = require('lib/mongoose'),
    User = require('models/user').User,
    SeriesLostFilm = require('models/content/series').SeriesLostFilm;

var net = require('net'),
    JsonSocket = require('json-socket');

var accessControl = require('accessControl');



var tls = require('tls');
var fs = require('fs');
var path = require('path');

var options = {
    key : fs.readFileSync(path.join( __dirname, 'certificates/server/key.pem')),
    cert : fs.readFileSync(path.join( __dirname, 'certificates/server/server.crt')),
    handshakeTimeout : 10
};

var passwordKey = 'd6F3Efeq';



var clients = [];

var server = tls.createServer(options, function (socket) {
    console.log('server connected', socket.authorized ? 'authorized' : 'unauthorized');
    socket.write('welcome!\n');
    socket.setEncoding('utf8');
    socket.pipe(socket);

    socket.name = socket.remoteAddress + ":" + socket.remotePort;

    clients.push(socket);




    // maybe Work only if authorized ??
    //This event is emitted after the handshaking process for a new connection has successfully completed.
    socket.on('secure', function (sessionId, sessionData, callback) {
        console.log('sessionId = \n');
        console.log(sessionId);

        console.log('-----------');

        console.log('sessionData = \n');
        console.log(sessionData);

        console.log('-----------');

        console.log('socket auth = ');
        console.log(socket.authorized);

        socket.name = socket.remoteAddress + ":" + socket.remotePort;

        clients.push(socket);

        callback();
    });


    socket.on('data', function (dataJSON) {
        var data = jsonTryParse(dataJSON);
        
        if (!data || !data.command) socket.write(JSON.stringify({error: 'incorrect json'}));
        
        executeRequestCommand(data, function(err, result){
            if (err) throw new Error(err);
            socket.write(JSON.stringify(result));
        });

    });


    // maybe Work only if authorized ??
    socket.on('newSession', function (sessionId, sessionData, callback) {
        console.log('sessionId = \n');
        console.log(sessionId);

        console.log('-----------');

        console.log('sessionData = \n');
        console.log(sessionData);

        console.log('-----------');

        console.log('socket auth = ');
        console.log(socket.authorized);

        socket.name = socket.remoteAddress + ":" + socket.remotePort;

        clients.push(socket);

        callback();
    });

    socket.on('error', function (err) {
        if (err.code === 'ECONNRESET')
            clients.splice(clients.indexOf(socket), 1);

        console.log(arguments);
    });




}).listen(8000, '192.168.0.100');



function broadcast(message, sender) {
    clients.forEach(function (client) {
        if (client === sender) return;
        client.write(message);
    });
    process.stdout.write(message)
}


function jsonTryParse(dataJson) {
    var data;
    try {
        data = JSON.parse(dataJson);
    } finally {
        return data
    }
}

function executeRequestCommand(data, callback) {
    switch (data.command.toLowerCase()) {
        case 'get series info':
            if (data.url){
                parser.parse(data.url, callback);
            }

    }    
}

setInterval(function () {
    parser.getUpdates('lostfilm', 2, function (err, res) {
        if (err) throw err;
        console.log('send updates, clients = ' + clients.length);

        clients.forEach(function (element, index, array) {
            if (!array[index].isOpen)
            array[index].write(JSON.stringify(res));
        });

        //socket.write(crypto.encryptBuf(JSON.stringify(res), password));

        // можно и без него
        //jsonSocket.sendEndMessage(res);

    });
}, 10000);

/*

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

    */