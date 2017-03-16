const testApp = angular.module('testApp', ['ngRoute', 'angular-jwt']);

testApp.config(($routeProvider, $locationProvider) => {
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', {
            templateUrl: 'templates/main.html',
            controller: 'mainController',
            access: {
                restricted: false
            }
        })

        .when('/login', {
            templateUrl: 'templates/login.html',
            controller: 'loginController',
            access: {
                restricted: false
            }
        })

        .when('/polls', {
            templateUrl: 'templates/pollsPage.html',
            controller: 'pollsController',
            access: {
                restricted: false
            }
        })

        .when('/poll/:id', {
            templateUrl: 'templates/pollPage.html',
            controller: 'pollController',
            access: {
                restricted: false
            }
        })

        .when('/profile', {
            templateUrl: 'templates/profile.html',
            controller: 'profileController',
            access: {
                restricted: true
            }
        })

        .when('/register', {
            templateUrl: 'templates/register.html',
            controller: 'registerController',
            access: {
                restricted: false
            }
        })

        .otherwise('/');
})
