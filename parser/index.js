var lostFilmParser = require('parser/LostFilmTV');

var regExpLostFilmSite = /https:\/\/www\.lostfilm\.tv/i;
var regExpLostFilmRoot = /lostfilm/i;

function parse(url, callback) {

    if (url.match(regExpLostFilmSite))
    {
        lostFilmParser.parse(url, callback);
    }
}

function getUpdates(siteName, resSize, callback) {

    if (siteName.match(regExpLostFilmRoot))
    {
        lostFilmParser.getUpdates(resSize, callback);
    }
}

function getSeriesList(siteName, callback) {

    if (siteName.match(regExpLostFilmRoot))
    {
        lostFilmParser.getSeriesList(callback);
    }
}


exports.getSeriesList = getSeriesList;
exports.getUpdates = getUpdates;
exports.parse = parse;





