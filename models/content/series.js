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
    for (var i in this.seasons){
        uniques.push(this.seasons[i].seasonNumber);
    }

    if (uniques.indexOf(season.seasonNumber) === -1){
        this.seasons.push(season);
    }

};


exports.SeriesLostFilm = mongoose.model('SeriesLostFilm', SeriesLostFilmSchema, baseContent.schemaName);

/*
SeriesLostFilm.methods.getLoginAndPassword = function () {
    return { login: 'basicUser', password: '123456'};
};
*/

//exports.SeriesLostFilm = mongoose.model('SeriesLostFilm', schema);


