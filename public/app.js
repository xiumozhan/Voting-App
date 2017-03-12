const testApp = angular.module('testApp', ['ngRoute', 'angular-jwt']);

testApp.config(($routeProvider, $locationProvider) => {
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', {
            templateUrl: 'templates/main.html',
            controller: 'mainController'
        })

        .when('/login', {
            templateUrl: 'templates/login.html',
            controller: 'loginController'
        })

        .when('/polls', {
            templateUrl: 'templates/polls.html',
            controller: 'pollsController'
        })

        .when('/polls/:id', {
            templateUrl: 'templates/poll.html',
            controller: 'pollController'
        })

        .when('/profile', {
            templateUrl: 'templates/profile.html',
            controller: 'profileController'
        })

        .otherwise('/');
})
