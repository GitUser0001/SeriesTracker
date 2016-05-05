var log = require('lib/log')(module),
    parser = require('parser');

var async = require('async');


log.info("Started");

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










/*
 var mongoose = require('lib/mongoose');
 var User = require('models/user').User;
 var Series = require('models/series').Series;
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