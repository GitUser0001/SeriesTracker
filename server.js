var log = require('lib/log')(module),
    tls = require('tls'),
    fs = require('fs'),
    path = require('path'),


    mongoose = require('lib/mongoose'),
    User = require('models/user').User,
    SeriesLostFilm = require('models/content/series').SeriesLostFilm,

    parser = require('parser');



var clients = [];

var options = {
    key : fs.readFileSync(path.join( __dirname, 'certificates/server/key.pem')),
    cert : fs.readFileSync(path.join( __dirname, 'certificates/server/server.crt')),
    handshakeTimeout : 10
};




var server = tls.createServer(options, function (socket) {
    console.log('server connected', socket.authorized ? 'authorized' : 'unauthorized');
    socket.write('welcome!\n');
    socket.setEncoding('utf8');
    socket.pipe(socket);

    socket.name = socket.remoteAddress + ":" + socket.remotePort;




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

        if (data && !contains(clients, socket)) {

            checkCredentials(data, function (err, user) {
                if (user) {
                    clients.push({ login: user.nick, rights: user.rights, socket: socket });
                } else {
                    socket.write(JSON.stringify({error: 'incorrect login or password'}));
                    socket.end();
                }
            });

        } else {
            if (!data || !data.command) socket.write(JSON.stringify({error: 'incorrect json'}));

            executeRequestCommand(data, function(err, result){
                socket.write(JSON.stringify(err || result));
            });
        }
        
        console.log('clients: ' + clients.length)
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

        // PARSE WEB SITE
        case 'get series info':
            if (data.url){
                parser.parse(data.url, callback);
            } break;
        case 'get updates':
            if (data.siteName && data.count){
                parser.getUpdates(data.siteName, data.count, callback);
            } break;
        case 'get all series':
            if (data.siteName){
                parser.getSeriesList(data.siteName, callback);
            } break;

        // WORK WITH USER
        case 'add series to user':
            if (data.url) {
                // not implement
            } break;
        case 'remove series from user':
            if (data.url) {
                // not implement
            } break;
        case 'get user\'s favorite list':
            // not implement
            break;

        // WORK WITH SERIES
        case 'add/update series in db':
            // not implement
            break;
        case 'get all series from db':
            // not implement
            break;

        default:
            callback('bad command');
    }
}

function checkCredentials(userData, callback) {
    if (userData.login && userData.password) {
        User.findOne({nick: userData.login}, function (err, user) {
            if (err) callback(err);
            if (user && user.checkPassword(userData.password)) {
                console.log('connected user ' + user.nick);
                callback(null, user);
            } else {
                console.log('fail to connect user ' + userData.login);
                callback();
            }
        })
    }
}

function contains(clientArray, socket) {

    for (var i=0; i < clientArray.length; i++){
        if (clientArray[i].socket === socket) {
            return true;
        }
    }
    return false;
}


/*
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
*/


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