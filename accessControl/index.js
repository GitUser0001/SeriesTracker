var crypto = require('../myCrypto');

exports.createAuthString = function (login, password, key) {
    return JSON.stringify({auth: { login: login, password: crypto.encryptNoIv( password, key)}});
};


exports.getAuthJson = function (authString, key) {
    if ((typeof authString) === String.type) {
        try {
            authString = JSON.parse(authString);
        } catch (err) {}
    }
    
    if (authString.auth){
        return {login : authString.auth.login, password: crypto.decryptNoIv(authString.auth.password, key)}
    } else {
        return null;
    }
};