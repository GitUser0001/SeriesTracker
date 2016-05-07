var crypto = require('crypto'),
    algorithm;

function encryptNoIv(text,password){
    algorithm = 'aes-256-ctr';
    var cipher = crypto.createCipher(algorithm,password);
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decryptNoIv(text, password){
    algorithm = 'aes-256-ctr';
    var decipher = crypto.createDecipher(algorithm,password);
    var dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
}

function encryptIv(text,password, iv) {
    algorithm = 'aes-256-gcm';
    var cipher = crypto.createCipheriv(algorithm, password, iv);
    var encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    var tag = cipher.getAuthTag();
    return {
        content: encrypted,
        tag: tag
    };
}

function decryptIv(encrypted,password, iv) {
    algorithm = 'aes-256-gcm';
    var decipher = crypto.createDecipheriv(algorithm, password, iv);
    decipher.setAuthTag(encrypted.tag);
    var dec = decipher.update(encrypted.content, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

function encryptBuf(buffer,password){
    algorithm = 'aes-256-ctr';
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = Buffer.concat([cipher.update(buffer),cipher.final()]);
    return crypted;
}

function decryptBuf(buffer,password){
    algorithm = 'aes-256-ctr';
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = Buffer.concat([decipher.update(buffer) , decipher.final()]);
    return dec;
}

exports.encryptNoIv = encryptNoIv;

exports.decryptNoIv = decryptNoIv;

exports.encryptIv = encryptIv;

exports.decryptIv = decryptIv;

exports.encryptBuf = encryptBuf;

exports.decryptBuf = decryptBuf;
