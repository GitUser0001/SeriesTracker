var crypto = require('../myCrypto');
var passwordKey = 'd6F3Efeq';


var tls = require('tls');
    //JsonSocket = require('json-socket');

var accessControl = require('../accessControl');

var fs = require('fs');
var path = require('path');

var HOST = '192.168.0.100';
var PORT = 8000;

// OPTIONS
var options = {
    key : fs.readFileSync(path.join( __dirname, '../certificates/client/key.pem')),
    cert : fs.readFileSync(path.join( __dirname, '../certificates/client/server.crt')),
    rejectUnauthorized : false
};



// CONNECT OT SERVER
var client = tls.connect(PORT, HOST, options, function () {
    console.log(client.authorized ? 'Authorized' : 'Not authorized')
});
client.setEncoding('utf8');

// Events
client.on('data', function(data) {
    console.log(data);
});
client.on('end', function() {
    client.close();
});
client.on('error', function (err) {
    console.log(arguments);
});


client.write(JSON.stringify({login: 'Василиса', password: 'qwerty'}));

// REQUESTS TO SERVER

setTimeout(function () {
    client.write(JSON.stringify({ command : 'get series info', url: 'https://www.lostfilm.tv/browse.php?cat=168'}));
    console.log('\n\t------------\n\n');
}, 2000);


setTimeout(function () {
    client.write(JSON.stringify({ command : 'get updates', siteName: 'lostfilm', count: 1}));
    console.log('\n\t------------\n\n');
}, 6000);


setTimeout(function () {
    client.write(JSON.stringify({ command : 'get all series', siteName: 'lostfilm'}));
    console.log('\n\t------------\n\n');
}, 8000);





/*

//var socket = new JsonSocket(new net.Socket()); //Decorate a standard net.Socket with JsonSocket
var socket = new net.Socket();
socket.connect(PORT, HOST);
socket.on('connect', function() { //Don't send until we're connected
    
    var login = 'Василиса',
        password = 'qwerty';
    
    socket.write(accessControl.createAuthString('Василиса','qwerty',passwordKey));
    
    socket.on('data', function(data) {
        console.log('DATA: ');
        console.log(JSON.parse(data));
    });
});


/*
var client = new net.Socket();
client.connect(PORT, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
    //client.write('I am Chuck Norris!');

});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {

    console.log('DATA: ' + data);

    //var dec = crypto.decryptNoIv(data[1], password);

    console.log(JSON.parse(data[0]));
    // Close the client socket completely
    //client.destroy();

});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});
    */