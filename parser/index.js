var lostFilmParser = require('parser/LostFilmTV');

var regExpLostFilmSite = /https:\/\/www\.lostfilm\.tv/i;
var regExpLostFilmRoot = /lostfilm/i;

function parse(url, callback) {

    if (url.match(regExpLostFilmSite))
    {
        lostFilmParser.parse(url, function (err, result) {
            callback(err, result);
        });
    }
}

function getUpdates(siteName, resSize, callback) {

    if (siteName.match(regExpLostFilmRoot))
    {
        lostFilmParser.getUpdates(resSize, function (err, result) {
            callback(err, result);
        });
    }
}

exports.getUpdates = getUpdates;
exports.parse = parse;





