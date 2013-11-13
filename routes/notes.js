var Evernote = require('evernote').Evernote;
var config = require('../config.json');
var isProduction = (process.env.NODE_ENV === 'production');
var port = process.env.PORT || 3000;
var callbackUrl = isProduction ? config.PRODUCTION_URL +'oauth_callback' : 'http://localhost:'+ port +'/oauth_callback';

exports.listNotes = function(req, res) {
    res.render('list', {
        layout: 'layouts/layout',
        title: 'ENML Editor: Note List'
    });
};