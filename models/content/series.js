var mongoose = require('lib/mongoose'),
    Schema = mongoose.Schema;

/*
var schema = new Schema({
    name:{
        type: String,       
        unique: true,
        required: true
    },
    image:{
        type: Buffer,
        required: false
    },
    contentType:{
        type: String,
        default: 'series'
    },
    rating:{
        type: Number,
        min: 0, max: 100,
        default: 0
    },
    country:{
        type: String,
        default: "Some country"
    },
    releaseYear:{
        type: Number,
        default: 1990
    }
});
*/

var seriesLostFilm = {
    name:{
        type: String,
        unique: true,
        required: true
    },
    image:{
        type: Buffer,
        required: false
    },
    contentType:{
        type: String,
        default: 'series'
    },
    rating:{
        type: Number,
        min: 0, max: 100,
        default: 0
    },
    country:{
        type: String,
        default: "Some country"
    },
    releaseYear:{
        type: Number,
        default: 1900
    },
    seasons:[{
        seasonNumber: { type:Number, require: true},
        seriesCount: { type: Number, require: true, min: 1, max: 100},
        series: [{
            seriesNumber: { type:Number, require: true, min: 1, max: 500},
            seriesName: { type: String, require: true},
            seriesSoundedBy: { type: String, default: 'Многоголосый закадровый (LostFilm.TV) '},
            seriesReleased: { type: Date, default: Date.now() }
        }]
    }]
};

require('sugar');
var baseContent = require('models/content/contentBase');
var SeriesLostFilmSchema = new Schema(Object.extended(baseContent.baseProperties).merge(seriesLostFilm));



SeriesLostFilmSchema.methods.addUserById = function (id) {
    this.users.addToSet(id);
 };


SeriesLostFilmSchema.methods.addSeason = function (season) {
    var uniques = [];
    for (var i=0; i < this.seasons.length; i++){
        uniques.push(this.seasons[i].seasonNumber);
    }

    if (uniques.indexOf(season.seasonNumber) === -1){
        this.seasons.push(season);
    }

};

function isUnique(arrayToCheck) {
    if (arrayToCheck.length === 0) {
        return true;
    }
    
    var uniques = [];

    for (var i = 0; i < arrayToCheck.length; i++){
        var contains = false;
        for (var j = 0; j < uniques.length; j++){
            if (uniques[j].toString() === arrayToCheck[i].toString()) {
                contains = true;
                break;
            }
        }

        if (!contains) uniques.push(arrayToCheck[i]);
    }

    return uniques.length === arrayToCheck.length;
}


SeriesLostFilmSchema.pre('save', function (next) {

    var seasons = [];
    //var seriesInSeasonNumbers = [];
    //var seriesInSeasonNames = [];
    for (var i in this.seasons){
        seasons.push(this.seasons[i].seasonNumber.toString());
        /*
        var seriesInCurrentSeasonNumbers = [];
        var seriesInCurrentSeasonNames = [];
        for (var j in this.seasons[i].series){
            seriesInCurrentSeasonNumbers.push(this.seasons[i].series[j].seriesNumber);
            seriesInCurrentSeasonNames.push(this.seasons[i].series[j].seriesName);
            }
        if (seriesInCurrentSeasonNumbers.length > 0) seriesInSeasonNumbers.push(seriesInCurrentSeasonNumbers);
        if (seriesInCurrentSeasonNames.length > 0) seriesInSeasonNames.push(seriesInCurrentSeasonNames);
        */
    }


    /*
    var isSeasonsNamesCorrect = true;
    for (var names in seriesInSeasonNames){
        if (!isUnique(names)) {
            isSeasonsNamesCorrect = false;
            break;
        }
    }

    var isSeasonsNumbersCorrect = true;
    for (var numbers in seriesInSeasonNumbers){
        if (!isUnique(numbers)) {
            isSeasonsNumbersCorrect = false;
            break;
        }
    }
    */




    if (isUnique(this.users) && isUnique(seasons)){// && isSeasonsNumbersCorrect && isSeasonsNamesCorrect){
        next();
    } else {
        var err = new Error("some values are duplicated");
        if (!isUnique(this.users)) { err = new Error("users are duplicated"); }
        else if (!isUnique(seasons)) { err = new Error("seasons are duplicated"); }
        next(err);
    }
});


SeriesLostFilmSchema.methods.getLoginAndPassword = function () {
    return { login: 'basicUser', password: '123456'};
};

exports.SeriesLostFilm = mongoose.model('SeriesLostFilm', SeriesLostFilmSchema, baseContent.schemaName);





//exports.SeriesLostFilm = mongoose.model('SeriesLostFilm', schema);


