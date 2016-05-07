var log = require('lib/log')(module),
    parser = require('parser');

var mongoose = require('lib/mongoose');
var async = require('async');

var crypto = require('myCrypto');

log.info("Started");

function testParser() {
    var url = ['https://www.lostfilm.tv/browse.php?cat=225','https://www.lostfilm.tv/browse.php?o=30'];



    parser.parse(url[0], function (err, res) {
        if (err) throw err;

        log.debug("Basic Info:");
        console.log(res);
        console.log("\n######################################");
    });



    setTimeout(function () {
        parser.parse(url[1], function (err, res) {
            if (err) throw err;

            log.debug("Updates on input page:" + "https://www.lostfilm.tv/browse.php?o=30");
            console.log(res);
            console.log("\n\nРозмiр " + res.length);
            console.log("\n######################################");
        })},500);


    setTimeout(function () {
        var itemsNeeded = 100;
        parser.getUpdates('lostfilm',itemsNeeded, function (err, res) {
            if (err) throw err;

            log.debug("Test getUpdates(), itemsNeeded = " + itemsNeeded);
            console.log(res);
            console.log("\n######################################\nРозмiр " + res.length);
        })}, 200);



}

//testParser();

var SeriesLostFilm;
function testDB(){
    var User = require('models/user').User;
    var Series = require('models/content/series').Series;
    SeriesLostFilm = require('models/content/series').SeriesLostFilm;


    var user1 = new User({nick: 'Dan', password: '1', email: 'lola@ukr.net'});
    var user2 = new User({nick: 'Dan', password: '1', email: 'lola@ukr.net'});




    User.findOne({email: 'v123@ukr.net'}, function (err, result) {
        if (err) throw err;
        var user = result;
        console.log('\n------------------\n');

        SeriesLostFilm.findOne({name: 'Gotham'}, function (err, result) {
            if (err) throw err;
            //console.log(result);
            console.log('\n------------------\n');


            result.addUserById(user._id);

            //result.users.push(user._id);


            //result.seasons.push({
            result.addSeason({
                seasonNumber: 1,
                seriesCount: 10,
                series: [{
                    seriesNumber: 1,
                    seriesName: 'ololo 1'
                },{
                    seriesNumber: 1,
                    seriesName: 'lola'
                }]
            });


            result.save(function (err) {
                if (err) throw err;
            });

            /*
            var a = result;
            a = a.toObject();
            a.users = user._id;

            result = result.toObject();
            //result.users = user._id;
            //result.users.push(new mongoose.Types.ObjectId(user._id));
            result.users.push({id: user._id});

            result.users.push({id: user._id});

            delete result['_id'];

            result = new Content(result);




            a = new Content({
                name: a.name,
                users: [{id: user._id}]});

            console.log(a);


            console.log(result);



            result.save(function (err) {
                if(err) throw err;
            });
             */
        });
    });
}

log.info("Finished");


var password = 'd6F3Efeq';

parser.getUpdates('lostfilm',2, function (err, res) {
    if (err) throw err;

    console.log(res);
    console.log('\n ------');

    var enc = crypto.encryptNoIv(JSON.stringify(res), password);

    console.log(enc);
    console.log('\n ------');

    var dec = crypto.decryptNoIv(enc, password);

    setTimeout(function () {
        console.log(JSON.parse(dec));
        console.log('\n ------');
    },200);

});

mongoose.disconnect();

/*
testDB();

setTimeout(function () {
    console.log('\n------------------\n');
    SeriesLostFilm.find({}, function (err, res) {
        console.log(res[0]);
        console.log("\n For login");
        console.log((new SeriesLostFilm).getLoginAndPassword());
        mongoose.disconnect();
    });

},1000);
*/



//var user1 = new User({nick: 'Dan', password: '1', email: 'lola@ukr.net'});
//var user2 = new User({nick: 'Dan', password: '1', email: 'lola@ukr.net'});

//series.users[0] = user1;
//series.users.push({nick: 'Dan', password: '1', email: 'lola@ukr.net'});


/*
 var userTest = require('models/series').UserTest;

 Series.findOne({name: 'Supernatural'}, function (err, result) {
 if (err) throw err;
 console.log(result);
 //console.log('-------------------');

 var user = new User({nick: 'Dan', password: '1', email: 'lola@ukr.net'});

 //result.users = [user1];
 //result.users.push(user);

 // ругаеться на unique

 result.save(function (err) {
 if (err) throw err;
 mongoose.disconnect();
 });
 });
 */

/*
 User.find({nick: 'Dan'}, function (err, result) {
 if (err) throw err;
 console.log(result);
 });
 Series.find({}, function (err, result) {
 if (err) throw err;
 console.log(result);
 });

 Series.find({}, function (err, result) {
 if (err) throw err;
 console.log("------------------------------");
 console.log(result[0].users);
 });
 */