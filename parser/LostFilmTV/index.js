
var fs = require('fs');
var https = require('lib/https');

const rootUrl = "https://www.lostfilm.tv";


var regExpSeriesInfoSite = /https:\/\/www\.lostfilm\.tv\/browse\.php\?cat=_?\d{1,4}/i;
var regExpSeriesUpdateListSite = /https:\/\/www\.lostfilm\.tv\/browse\.php(?:\?o=(?:\d{1,5}))?/i;
var regExpSeriesListSite = /https:\/\/www\.lostfilm\.tv\/serials\.php/;

var regExpSeriesInfo = /<h1>(.*)<\/.*\s*<img.*src="(.*?\.\w*)[^а-я]*(.*)[^а-я]*(.*)[^а-я]*(.*)[^а-я]*(.*)[^а-я]*(.*)[^а-я]*(.*)[^а-я]*(.*)[^а-я]*(.*)[^]*?<span>([^]*?<\/span>)/ig;
var regExpSeriesUpdateList = /v.*?">\s*(\d*\.\d*)[^]*?\d">([^]*?)<[^]*?f="(.*?)".*?c="([^]*?)"[^]*?<b>([^]*?)<[^]*?.*\s*(.*?)(з.*)/ig;
var regExpSeriesList = /<a.*?"(\/b.*?t=\d{1,5})".*?>(.*)/g;

var regExpRemoveTags = /<[^]*?>/ig;
var regExpRemoveComments = /<!--[^]*?-->/ig;

var regExpToMatchData = /дата.*?\d{2}\.\d{2}\.\d{2}/ig;

function removeTags(mas) {
    var s;
    for (var i in mas){
        s = mas[i].toString();
        mas[i] = s.replace(regExpRemoveTags,'');
    }
    return mas;
}

function removeComments(body){
    var s;
    s = body;
    body = s.replace(regExpRemoveComments,'');
    return body;
}

function createSeriesBaseInfoJSON(body) {
    var res = regExpSeriesInfo.exec(body);

    if (!res || res.length == 0) throw new Error("body not confirmed");

    res = removeTags(res);

    return {
        name: res[1],
        imgLink: rootUrl + res[2],
        country: res[3],
        released: res[4],
        genres: res[5],
        seasons: res[6],
        status: res[7],
        seriesSite: res[8],
        seriesRusSite: res[9],
        forumLink: res[10],
        description: res[11]
    }
}

function createSeriesUpdateListJSON(body) {
    var res = [];

    var tmp = removeComments(body);
    var match;
    while (match = regExpSeriesUpdateList.exec(tmp)) {
        // регулярка ловит лишний контент (почти одентичный)
        if (match[6].match(regExpToMatchData)) {

            match = removeTags(match);

            res.push({
                seriesNumber: match[1],
                seriesName: match[2],
                seriesLink: rootUrl + match[3],
                seriesIcon: rootUrl + match[4],
                seriesCurrentName: match[5],
                seriesCurrentRelease: match[6],
                seriesSoundedBy: match[7]
            })
        }
    }
    return res;
}

function createSeriesListJSON(body) {
    var res = [];
    
    body = removeComments(body);
    body = body.split('Полный список сериалов')[1];

    var match;

    while (match = regExpSeriesUpdateList.exec(tmp)) {
        match = removeTags(match);

        res.push({
            seriesLink: rootUrl + match[1],
            seriesName: match[2]
        });
    }
}
//<a.*?"(\/b.*?t=\d{1,5})".*?>(.*)
function getSeriesList(callback) {
    const staticUrl = 'https://www.lostfilm.tv/serials.php';

    var res = [];

    https.get(staticUrl, function (err, body) {
        if (err) { callback(err); return; }
        body = removeComments(body);
        body = body.split('Полный список сериалов')[1];

        var match;

        while (match = regExpSeriesList.exec(body)) {
            match = removeTags(match);

            res.push({
                seriesLink: rootUrl + match[1],
                seriesName: match[2]
            });
        }
        
        callback(null, res);
    });

}

function getUpdatePageLink(pageNumber) {
    const staticUrl = 'https://www.lostfilm.tv/browse.php?o=';

    if (!pageNumber && pageNumber != 0) throw new Error("check arguments of getUpdatePageLink method, number is " + pageNumber);

    return staticUrl + (pageNumber * 15);
}





function parse(uri, callback) {
    
    https.get(uri, function (err, body) {
        if (err) throw err;
        
        var res;
                
        if (uri.match(regExpSeriesInfoSite)){
            res = createSeriesBaseInfoJSON(body);
        } else if (uri.match(regExpSeriesUpdateListSite)) {
            res = createSeriesUpdateListJSON(body);
        } else if (uri.match(regExpSeriesListSite)){
            res = createSeriesListJSON(body);
        } else{
            callback("uri doesn't match")
        }

        callback(null, res);
    });
}



function getUpdates(resSize, callback) {
    if (resSize > 500) throw new Error("check resSize = " + resSize);

    var res = [];

    myLoop(0);

    function myLoop(currPageNumber) {
        var url = getUpdatePageLink(currPageNumber);

        https.get(url, function (err, body) {

            if (err) {
                callback(err);
            }
            else {

                var tmp = createSeriesUpdateListJSON(body);

                if (tmp == 0) {
                    resSize = res.length;
                }

                for (var i = 0, len = tmp.length; i < len; i++) {
                    res.push(tmp[i]);

                    if (res.length == resSize) break;
                }

                if(res.length == resSize) {
                    callback(null, res);
                } else {
                    myLoop(++currPageNumber);
                }
            }
        });
    }
}

exports.parse = parse;

exports.getUpdates = getUpdates;

exports.getSeriesList = getSeriesList;


