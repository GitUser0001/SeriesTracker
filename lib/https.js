var iconv = require('iconv-lite');
const https = require('https');


function get(url, callback) {
    https.get(url, function (res) {
        var statusCode = res.statusCode;
        if (statusCode != 200) {
            callback("non-200 response status code:" + res.statusCode + "| for url: "+ url);
        }

        res.setEncoding('binary');
        var data = "";
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on("end", function () {
            var body = iconv.decode(new Buffer(data, 'binary'), 'win1251');
            callback(null, body);
        });
    });
}



exports.get = get;