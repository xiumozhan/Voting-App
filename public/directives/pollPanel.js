testApp.directive('pollPanel', function() {
    return {
        restrict: 'E',
        templateUrl: '../templates/pollPanel.html',
        replace: true,
        scope: {
            name: '='
        }
    }
});
