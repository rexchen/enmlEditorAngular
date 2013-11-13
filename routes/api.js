var Evernote = require('evernote').Evernote;
var config = require('../config.json');
var isProduction = (process.env.NODE_ENV === 'production');
var port = process.env.PORT || 3000;
var callbackUrl = isProduction ? config.PRODUCTION_URL +'oauth_callback' : 'http://localhost:'+ port +'/oauth_callback';

exports.listNotes = function(req, res) {
    var client = new Evernote.Client({
        token: req.session.oauthAccessToken,
        sandbox: config.SANDBOX
    });
    var noteStore = client.getNoteStore();

    var notes = [];
    var filter = new Evernote.NoteFilter();
    filter.notebookGuid = req.session.slideNotebook.guid;
    filter.order = 2; //sort by UPDATED time
    var offset = 0;
    var spec = new Evernote.NotesMetadataResultSpec();
    spec.includeTitle = true;
    spec.includeUpdated = true;
    
    noteStore.findNotesMetadata(filter, offset, 20, spec, function(err, response){
        var notesList = response.notes;
        console.log(notesList);

        for(var i in notesList){
            notes.push({
                guid: notesList[i].guid,
                title: notesList[i].title,
                updated: notesList[i].updated
            });
        }
        res.json(notes);
    });
};

exports.createNote = function(req, res) {
    console.log(req.body);
    var data = req.body;

    
    var client = new Evernote.Client({
        token: req.session.oauthAccessToken,
        sandbox: config.SANDBOX
    });
    var noteStore = client.getNoteStore();

    var note = new Evernote.Note();
    note.title = data.title;
    note.content = data.content;
    note.notebookGuid = req.session.slideNotebook.guid;

    noteStore.createNote(note, function(err, note){
        res.send('create success');
    });
    
};

exports.getNote = function(req, res) {
    //get note content
    var client = new Evernote.Client({
        token: req.session.oauthAccessToken,
        sandbox: config.SANDBOX
    });
    var noteStore = client.getNoteStore();
    var guid = req.params.id;

    noteStore.getNote(guid, true, false, false, false, function(err, note){
        res.json(note);
    });
};

exports.updateNote = function(req, res) {
    console.log(req.params.id);
    console.log(req.body);

    var data = req.body;

    var client = new Evernote.Client({
        token: req.session.oauthAccessToken,
        sandbox: config.SANDBOX
    });
    var noteStore = client.getNoteStore();
    var guid = req.params.id;

    noteStore.getNote(guid, true, false, false, false, function(err, note){
        note.title = data.title;
        note.content = data.content
        noteStore.updateNote(note, function(err, note){
            res.send('update success');
        });
    });
};

exports.deleteNote = function(req, res) {
    console.log(req.params.id);

    var client = new Evernote.Client({
        token: req.session.oauthAccessToken,
        sandbox: config.SANDBOX
    });
    var noteStore = client.getNoteStore();
    var guid = req.params.id;

    noteStore.getNote(guid, true, false, false, false, function(err, note){
        note.active = false;
        noteStore.updateNote(note, function(err, note){
            res.send('delete success');
        });
    });
};