var crypto = require('../myCrypto');
var password = 'd6F3Efeq';


var net = require('net'),
    JsonSocket = require('json-socket');

var HOST = '192.168.0.100';
var PORT = 5000;

var socket = new JsonSocket(new net.Socket()); //Decorate a standard net.Socket with JsonSocket
socket.connect(PORT, HOST);
socket.on('connect', function() { //Don't send until we're connected
    socket.on('message', function(message) {
        console.log('The result is:');
        console.log(message);
    });
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