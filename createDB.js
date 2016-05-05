var mongoose = require('lib/mongoose');
// для работы в с фун-ми и callback
// позволяет делать async последовательности вызовов:
// серийные, паралельные, работает с масивами
var async = require('async');

async.series([
    open,
    dropDatabase,
    requireModels,
    createUsers,
    createSeries
], function (err) {
    console.log(arguments);    
    mongoose.disconnect();
    process.exit(err ? 255 : 0);
});


function open(callback) {
    mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}

function requireModels(callback) {
    require('models/user');
    require('models/series');
    // проходим по всем моделям и для каждой из них вызвать ensureIndexes
    // гарантирует как только все индексы будут созданы вызоветься callback
    async.each(Object.keys(mongoose.models), function (modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function createUsers(callback) {


    var users = [
        {nick: 'Пауль', password: '123', email: 'shark@ukr.net'},
        {nick: 'Василиса', password: 'qwerty', email: 'v123@ukr.net'},
        {nick: 'Дянка', password: 'goodboy', email: 'hater@ukr.net'}
    ];

    async.each(users, function (userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback);
}

function createSeries(callback) {
    console.log('111111111111111111111111111');
    var series = [
        {url: 'https://www.lostfilm.tv/browse.php?cat=225', name: 'Gotham', contentType: 'series'},
        {url: 'https://www.lostfilm.tv/browse.php?cat=65', name: 'Supernatural', contentType: 'series'}
    ];

    async.each(series, function (seriesData, callback) {
        var series = new mongoose.models.Series(seriesData);

        //var user1 = new mongoose.models.User({nick: 'Dan', password: '1', email: 'lola@ukr.net'});
        //var user2 = new mongoose.models.User({nick: 'Dan', password: '1', email: 'lola@ukr.net'});

        //series.users[0] = user1;
        //series.users.push({nick: 'Dan', password: '1', email: 'lola@ukr.net'});
        //series.users.push(user2);

        series.save(callback);
    }, callback);
}
