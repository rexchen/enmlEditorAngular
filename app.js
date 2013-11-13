var express = require('express');
var routes = require('./routes');
var note = require('./routes/notes');
var api = require('./routes/api');
var http = require('http');
var path = require('path');
var compass = require('node-compass');

var app = express();
app.engine('html', require('hogan-express'));
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('enmlEditorSecret'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(compass({mode: 'compact', comments: true}));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/oauth', routes.oauth);
app.get('/oauth_callback', routes.oauth_callback);
app.get('/logout', routes.logout);

app.get('/notes', note.listNotes);

//angular api
app.get('/api/notes', api.listNotes);
app.post('/api/notes', api.createNote);
app.get('/api/notes/:id', api.getNote);
app.post('/api/notes/:id', api.updateNote);
app.delete('/api/notes/:id', api.deleteNote);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});