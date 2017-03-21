testApp.directive('navContainer', function() {
    return {
        restrict: 'E',
        templateUrl: '../templates/navigation.html',
        controller: 'navController',
        replace: true,
        scope: {
            fake: '='
        }
    }
});
