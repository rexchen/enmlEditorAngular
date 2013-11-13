
var enmlEditor = angular.module('enmlEditor', ['ui.ace', 'ngResource']).
factory('Notes', ['$resource', function($resource) {
    return $resource('/api/notes/:guid', {guid: '@guid'});
}]).
config(function($routeProvider) {
    $routeProvider.
        when('/', {
            controller: ListCtrl,
            templateUrl: '/partials/list.html'
        }).
        when('/edit/:guid', {
            controller: EditCtrl,
            templateUrl: '/partials/detail.html'
        }).
        when('/new', {
            controller: CreateCtrl,
            templateUrl: '/partials/detail.html'
        }).
        otherwise({
            redirectTo: '/'
        });
});

function ListCtrl($scope, Notes) {
    $scope.notes = Notes.query();
}

function CreateCtrl($scope, $location, $timeout, Notes) {
    $scope.aceOption = {
        mode: 'html',
        theme: 'twilight',
        onLoad: function (_ace) {
            _ace.setFontSize('1em');
            console.log('ace init');
            var defaultContent = [
                '<?xml version="1.0" encoding="UTF-8"?>',
                '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">',
                '<en-note>',
                '',
                '</en-note>'
            ].join('\n');
            note = new Notes();
            note.content = defaultContent;
            $scope.note = note;
        }
    };
    $scope.save = function() {
        var note = new Notes({
            title: $scope.note.title,
            content: $scope.note.content,
        });
        note.$save(function(){
            $location.path('/');
        });
        
    }
}

function EditCtrl($scope, $location, $routeParams, Notes) {
    console.log($routeParams.guid);
    $scope.aceOption = {
        mode: 'html',
        theme: 'twilight',
        onLoad: function (_ace) {
            _ace.setFontSize('1em');
            console.log('ace init');
        }
    };
    $scope.note = Notes.get({guid: $routeParams.guid});
    $scope.destroy = function() {
        $scope.note.$remove(function(){
            $location.path('/');
        });
    };
    $scope.save = function() {
        $scope.note.$save(function(){
            $location.path('/');
        });
        
    };
}