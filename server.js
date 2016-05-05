var log = require('lib/log')(module),
    parser = require('parser'),
    mongoose = require('lib/mongoose'),
    User = require('models/user').User,
    Series = require('models/series').Series;


log.info("Started");

